import { NextResponse } from "next/server"
import { requireSessionUser } from "@/lib/auth/require-session"
import {
  upsertUserBusiness,
  setActiveBusiness,
} from "@/lib/services/business-service"
import { upsertBusinessAiConfig } from "@/lib/services/ai-config-service"
import { getUserProfile, completeUserOnboarding } from "@/lib/services/user-service"
import { completeOnboardingSchema, updateActiveBusinessSchema } from "@/lib/ai-config/schema"

export async function GET() {
  const session = await requireSessionUser()
  if (!session.ok) {
    return NextResponse.json({ error: session.error }, { status: session.status })
  }

  const profile = await getUserProfile(session.user.id)
  if (!profile) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
  }

  return NextResponse.json({ user: profile })
}

export async function PATCH(request: Request) {
  const session = await requireSessionUser()
  if (!session.ok) {
    return NextResponse.json({ error: session.error }, { status: session.status })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  const activeParsed = updateActiveBusinessSchema.safeParse(body)
  if (activeParsed.success) {
    try {
      await setActiveBusiness(session.user.id, activeParsed.data.activeBusinessId)
    } catch {
      return NextResponse.json({ error: "Negocio no encontrado" }, { status: 404 })
    }
    const profile = await getUserProfile(session.user.id)
    return NextResponse.json({ user: profile })
  }

  return NextResponse.json({ error: "Operación no soportada" }, { status: 400 })
}

export async function POST(request: Request) {
  const session = await requireSessionUser()
  if (!session.ok) {
    return NextResponse.json({ error: session.error }, { status: session.status })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  const parsed = completeOnboardingSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos de onboarding inválidos", details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const business = await upsertUserBusiness(session.user.id, parsed.data.business)
  const config = await upsertBusinessAiConfig(business.id, parsed.data.aiConfig)
  await completeUserOnboarding(session.user.id, business.id)

  const profile = await getUserProfile(session.user.id)

  return NextResponse.json({
    business: {
      id: business.id,
      googleAccountId: business.googleAccountId,
      googleLocationId: business.googleLocationId,
      name: business.name,
      address: business.address,
      phone: business.phone,
      isDemo: business.isDemo,
      createdAt: business.createdAt.toISOString(),
      updatedAt: business.updatedAt.toISOString(),
    },
    config,
    user: profile,
  })
}
