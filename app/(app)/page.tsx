import { createSupabaseServer } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = await createSupabaseServer()

  const [{ count: totalApplicants }, { count: deployed }, { count: docsOnProcess }, { count: forBooking }] =
    await Promise.all([
      supabase.from("applicants").select("*", { count: "exact", head: true }),
      supabase
        .from("applicants")
        .select("*", { count: "exact", head: true })
        .in("status", ["Deployed", "Deployed(With Concerns)"]),
      supabase
        .from("applicants")
        .select("*", { count: "exact", head: true })
        .eq("status", "Docs on Process"),
      supabase
        .from("applicants")
        .select("*", { count: "exact", head: true })
        .eq("status", "For Booking"),
    ])

  const stats = [
    { title: "Total Applicants", value: totalApplicants ?? 0 },
    { title: "Deployed", value: deployed ?? 0 },
    { title: "Docs on Process", value: docsOnProcess ?? 0 },
    { title: "For Booking", value: forBooking ?? 0 },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="text-sm text-gray-500">
              {item.title}
            </div>
            <div className="text-2xl font-bold mt-2">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
