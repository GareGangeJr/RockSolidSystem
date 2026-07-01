export function formatApplicantRef(id: number | null | undefined): string {
  if (id == null || Number.isNaN(Number(id))) return "--"
  return `APP-${new Date().getFullYear()}-${id}`
}
