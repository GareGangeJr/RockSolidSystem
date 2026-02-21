export default function Home() {
  const stats = [
    { title: "Total Applicants", value: 120 },
    { title: "Deployed", value: 45 },
    { title: "For Processing", value: 30 },
    { title: "For Deployment", value: 15 },
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
  