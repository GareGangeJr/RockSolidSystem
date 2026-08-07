import { headers } from "next/headers"

function getClientIp(headerStore: Headers) {
  const forwarded = headerStore.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || ""
  }
  return headerStore.get("x-real-ip")?.trim() || headerStore.get("cf-connecting-ip")?.trim() || ""
}

/** If KIOSK_ALLOWED_IPS is set, only those IPs can use the kiosk. Empty = allow all (local dev). */
export async function assertOfficeNetwork() {
  const allowed = (process.env.KIOSK_ALLOWED_IPS ?? "")
    .split(",")
    .map((ip) => ip.trim())
    .filter(Boolean)

  if (allowed.length === 0) return { ok: true as const }

  const headerStore = await headers()
  const clientIp = getClientIp(headerStore)

  if (clientIp && allowed.includes(clientIp)) {
    return { ok: true as const }
  }

  return {
    ok: false as const,
    error: "Time in/out is only allowed from the office network.",
  }
}
