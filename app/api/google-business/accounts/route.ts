import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function GET() {
  const session = await auth()

  if (!session?.accessToken) {
    return NextResponse.json(
      { error: "No hay sesión activa de Google." },
      { status: 401 }
    )
  }

  try {
    const accountsResponse = await fetch(
      "https://mybusinessbusinessinformation.googleapis.com/v1/accounts",
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    )

    if (!accountsResponse.ok) {
      const errorText = await accountsResponse.text()
      return NextResponse.json(
        { error: "No se pudieron cargar las cuentas de Google Business Profile.", details: errorText },
        { status: accountsResponse.status }
      )
    }

    const accountsData = await accountsResponse.json()
    const accounts = Array.isArray(accountsData.accounts) ? accountsData.accounts : []

    const enrichedAccounts = await Promise.all(
      accounts.map(async (account: any) => {
        const accountId = account.name?.split("/").pop() || ""

        const locationsResponse = await fetch(
          `https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations?readMask=name,title,storeCode,primaryPhone,websiteUri,languageCode,primaryCategory,locationState`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        )

        const locationsData = locationsResponse.ok
          ? await locationsResponse.json()
          : { locations: [] }

        const locations = Array.isArray(locationsData.locations)
          ? locationsData.locations.map((location: any) => {
              const locationId = location.name?.split("/").pop() || ""
              const address = location.locationState?.address?.lines?.join(", ") || ""

              return {
                id: locationId,
                name: location.name || location.title || "Ubicación",
                title: location.title || "Ubicación",
                locationId,
                accountId,
                address,
                phone: location.primaryPhone || "",
                website: location.websiteUri || "",
                category: location.primaryCategory?.displayName || "",
              }
            })
          : []

        return {
          id: accountId,
          accountId,
          name: account.accountName || account.name || "Cuenta de Google Business",
          locations,
        }
      })
    )

    return NextResponse.json({ accounts: enrichedAccounts })
  } catch (error) {
    console.error("Google Business Profile API error", error)
    return NextResponse.json(
      { error: "Error interno al obtener las cuentas de Google Business Profile." },
      { status: 500 }
    )
  }
}
