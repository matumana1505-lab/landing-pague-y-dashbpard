import { NextResponse } from "next/server"
import { requireSessionUser } from "@/lib/auth/require-session"
import {
  listUserBusinesses,
  upsertUserBusiness,
  setActiveBusiness,
  getBusinessForUser,
} from "@/lib/services/business-service"
import { getUserProfile } from "@/lib/services/user-service"
import { upsertBusinessSchema, updateActiveBusinessSchema } from "@/lib/ai-config/schema"
import type { PersistedBusiness } from "@/lib/types"

function toPersistedBusiness(business: {
  id: string
  googleAccountId: string
  googleLocationId: string
  name: string
  address: string | null
  phone: string | null
  isDemo: boolean
  createdAt: Date
  updatedAt: Date
}): PersistedBusiness {
  return {
    id: business.id,
    googleAccountId: business.googleAccountId,
    googleLocationId: business.googleLocationId,
    name: business.name,
    address: business.address,
    phone: business.phone,
    isDemo: business.isDemo,
    createdAt: business.createdAt.toISOString(),
    updatedAt: business.updatedAt.toISOString(),
  }
}

export async function GET() {
  const session = await requireSessionUser()
  if (!session.ok) {
    return NextResponse.json({ error: session.error }, { status: session.status })
  }

  const [businesses, profile] = await Promise.all([
    listUserBusinesses(session.user.id),
    getUserProfile(session.user.id),
  ])

  return NextResponse.json({
    businesses: businesses.map(toPersistedBusiness),
    activeBusinessId: profile?.activeBusinessId ?? null,
  })
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

  const parsed = upsertBusinessSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos de negocio inválidos", details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const business = await upsertUserBusiness(session.user.id, parsed.data)

  return NextResponse.json({
    business: toPersistedBusiness(business),
  })
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

  const parsed = updateActiveBusinessSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  if (parsed.data.activeBusinessId) {
    const owned = await getBusinessForUser(
      session.user.id,
      parsed.data.activeBusinessId
    )
    if (!owned) {
      return NextResponse.json({ error: "Negocio no encontrado" }, { status: 404 })
    }
  }

  try {
    await setActiveBusiness(session.user.id, parsed.data.activeBusinessId)
  } catch {
    return NextResponse.json({ error: "Negocio no encontrado" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
