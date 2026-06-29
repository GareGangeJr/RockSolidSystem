"use client"

import Link from "next/link"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Users, Briefcase, Building2, UserCheck, FileText, Plane } from "lucide-react"

export type StatCard = {
  title: string
  value: number
  icon: "applicants" | "deployed" | "jobOrders" | "employees" | "docs" | "booking"
  color: string
}

export type CountItem = { name: string; count: number }
export type MonthlyItem = { month: string; count: number }

export type RecentApplicant = {
  id: number
  name: string
  position: string
  status: string
  date: string
}

export type RecentDeployment = {
  id: number
  applicantName: string
  country: string
  status: string
  date: string
}

type Props = {
  stats: StatCard[]
  statusCounts: CountItem[]
  typeCounts: CountItem[]
  countryCounts: CountItem[]
  monthlyApplicants: MonthlyItem[]
  recentApplicants: RecentApplicant[]
  recentDeployments: RecentDeployment[]
}

const CHART_COLORS = ["#2563eb", "#16a34a", "#9333ea", "#9333ea", "#0891b2", "#dc2626", "#ca8a04", "#64748b"]

const iconMap = {
  applicants: Users,
  deployed: Plane,
  jobOrders: Briefcase,
  employees: UserCheck,
  docs: FileText,
  booking: Building2,
}

export default function DashboardView({
  stats,
  statusCounts,
  typeCounts,
  countryCounts,
  monthlyApplicants,
  recentApplicants,
  recentDeployments,
}: Props) {
  const topStatuses = statusCounts.slice(0, 8)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {stats.map((item) => {
          const Icon = iconMap[item.icon]
          return (
            <div key={item.title} className="rounded-lg border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{item.title}</p>
                <div className={`rounded-lg p-2 ${item.color}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Applicants by Status">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topStatuses} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="New Applicants per Month" subtitle="Last 6 months">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyApplicants}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Applicant Type" subtitle="By applicant category">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={typeCounts}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {typeCounts.map((_, index) => (
                  <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Deployments by Country" subtitle="From monitoring records">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={countryCounts.slice(0, 6)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#9333ea" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="border-b px-5 py-4">
            <h2 className="font-semibold text-gray-900">Recent Applicants</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Position</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentApplicants.map((row) => (
                  <tr key={row.id} className="border-t">
                    <td className="p-3">
                      <Link href={`/applicants/${row.id}`} className="text-blue-600 hover:underline">
                        {row.name}
                      </Link>
                    </td>
                    <td className="p-3">{row.position}</td>
                    <td className="p-3">{row.status}</td>
                    <td className="p-3">{row.date}</td>
                  </tr>
                ))}
                {recentApplicants.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-gray-500">
                      No applicants yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg border bg-white shadow-sm">
          <div className="border-b px-5 py-4">
            <h2 className="font-semibold text-gray-900">Recent Deployments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Applicant</th>
                  <th className="p-3 text-left">Country</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentDeployments.map((row) => (
                  <tr key={row.id} className="border-t">
                    <td className="p-3">{row.applicantName}</td>
                    <td className="p-3">{row.country}</td>
                    <td className="p-3">{row.status}</td>
                    <td className="p-3">{row.date}</td>
                  </tr>
                ))}
                {recentDeployments.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-gray-500">
                      No deployments yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-gray-900">{title}</h2>
      {subtitle ? <p className="text-xs text-gray-500">{subtitle}</p> : null}
      <div className="mt-4">{children}</div>
    </div>
  )
}
