import { NextResponse } from "next/server"
import { requireSessionUser } from "@/lib/auth/require-session"
import { getBusinessForUser } from "@/lib/services/business-service"
import {
  getBusinessAiConfig,
  upsertBusinessAiConfig,
} from "@/lib/services/ai-config-service"
import { businessAiConfigSchema } from "@/lib/ai-config/schema"
import { prisma } from "@/lib/prisma"

type RouteContext = {
  params: Promise<{ businessId: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  const session = await requireSessionUser()
  if (!session.ok) {
    return NextResponse.json({ error: session.error }, { status: session.status })
  }

  const { businessId } = await context.params
  const business = await getBusinessForUser(session.user.id, businessId)

  if (!business) {
    return NextResponse.json({ error: "Negocio no encontrado" }, { status: 404 })
  }

  const existing = await prisma.businessAiConfig.findUnique({
    where: { businessId },
  })
  const config = await getBusinessAiConfig(businessId)

  return NextResponse.json({
    businessId,
    config,
    isDefault: existing === null,
  })
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await requireSessionUser()
  if (!session.ok) {
    return NextResponse.json({ error: session.error }, { status: session.status })
  }

  const { businessId } = await context.params
  const business = await getBusinessForUser(session.user.id, businessId)

  if (!business) {
    return NextResponse.json({ error: "Negocio no encontrado" }, { status: 404 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  const parsed = businessAiConfigSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Configuración inválida", details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const config = await upsertBusinessAiConfig(businessId, parsed.data)

  return NextResponse.json({
    businessId,
    config,
    isDefault: false,
  })
}
