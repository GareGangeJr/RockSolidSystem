"use client"

import Link from "next/link"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
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
import { Users, Briefcase, UserCheck, FileText, Plane, UserX } from "lucide-react"
import { formatApplicantRef } from "@/lib/format-applicant-ref"

export type StatCard = {
  title: string
  value: number
  icon: "applicants" | "deployed" | "jobOrders" | "employees" | "docs" | "deported"
  color: string
}

export type CountItem = { name: string; count: number }
export type MonthlyItem = { monthKey: string; month: string; count: number }

export type RecentApplicant = {
  id: number
  name: string
  position: string
  status: string
  date: string
}

export type RecentDeployment = {
  id: number
  applicantId: number
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

const CHART_COLORS = ["#2563eb", "#16a34a", "#9333ea", "#0891b2", "#dc2626", "#ca8a04", "#64748b", "#ea580c"]

const AXIS_TICK = { fontSize: 13, fill: "#374151", fontWeight: 500 as const }
const CHART_HEIGHT = 340

const tooltipProps = {
  cursor: { fill: "transparent" },
  contentStyle: {
    fontSize: 14,
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.08)",
  },
  labelStyle: { fontWeight: 600, color: "#111827", marginBottom: 4 },
  itemStyle: { color: "#374151", fontSize: 13 },
}

const COUNT_LABEL = {
  fill: "#111827",
  fontSize: 13,
  fontWeight: 600,
}

function countAxis(values: number[]) {
  const dataMax = Math.max(...values, 0)
  const max = dataMax === 0 ? 4 : Math.max(dataMax, 1)

  if (max <= 12) {
    return {
      domain: [0, max] as [number, number],
      ticks: Array.from({ length: max + 1 }, (_, index) => index),
    }
  }

  const step = max <= 24 ? 2 : 5
  const top = Math.ceil(max / step) * step
  const ticks: number[] = []
  for (let value = 0; value <= top; value += step) ticks.push(value)

  return { domain: [0, top] as [number, number], ticks }
}

const iconMap = {
  applicants: Users,
  deployed: Plane,
  jobOrders: Briefcase,
  employees: UserCheck,
  docs: FileText,
  deported: UserX,
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
  const topCountries = countryCounts.slice(0, 6)
  const monthlyAxis = countAxis(monthlyApplicants.map((item) => item.count))
  const countryAxis = countAxis(topCountries.map((item) => item.count))
  const statusAxis = countAxis(topStatuses.map((item) => item.count))

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
          {topStatuses.length === 0 ? (
            <EmptyChart message="No applicant status data yet." />
          ) : (
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
              <BarChart data={topStatuses} layout="vertical" margin={{ top: 8, right: 36, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  domain={statusAxis.domain}
                  ticks={statusAxis.ticks}
                  tick={AXIS_TICK}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={128}
                  tick={{ ...AXIS_TICK, fontSize: 12 }}
                  interval={0}
                />
                <Tooltip {...tooltipProps} />
                <Bar dataKey="count" name="Applicants" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={22}>
                  <LabelList dataKey="count" position="right" {...COUNT_LABEL} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="New Applicants per Month" subtitle="Last 6 months">
          <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
            <LineChart data={monthlyApplicants} margin={{ top: 20, right: 24, left: 4, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ ...AXIS_TICK, fontSize: 12 }}
                tickMargin={10}
                interval={0}
                height={40}
              />
              <YAxis
                allowDecimals={false}
                domain={monthlyAxis.domain}
                ticks={monthlyAxis.ticks}
                tick={AXIS_TICK}
                width={36}
              />
              <Tooltip {...tooltipProps} />
              <Line
                type="linear"
                dataKey="count"
                name="Applicants"
                stroke="#16a34a"
                strokeWidth={3}
                dot={{ r: 5, fill: "#16a34a", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 7 }}
              >
                <LabelList dataKey="count" position="top" offset={12} {...COUNT_LABEL} />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Applicant Type" subtitle="By applicant category">
          {typeCounts.length === 0 ? (
            <EmptyChart message="No applicant type data yet." />
          ) : (
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
              <PieChart margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                <Pie
                  data={typeCounts}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="42%"
                  outerRadius={98}
                  innerRadius={42}
                  paddingAngle={2}
                  label={false}
                >
                  {typeCounts.map((_, index) => (
                    <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="#fff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip {...tooltipProps} />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{ fontSize: 13, lineHeight: "22px", paddingTop: 12 }}
                  formatter={(value, entry) => {
                    const count = (entry.payload as CountItem | undefined)?.count ?? 0
                    return `${value} (${count})`
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Deployments by Country" subtitle="From monitoring records">
          {topCountries.length === 0 ? (
            <EmptyChart message="No deployment data yet." />
          ) : (
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
              <BarChart data={topCountries} margin={{ top: 24, right: 16, left: 4, bottom: 48 }} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ ...AXIS_TICK, fontSize: 12 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={56}
                  tickMargin={8}
                />
                <YAxis
                  allowDecimals={false}
                  domain={countryAxis.domain}
                  ticks={countryAxis.ticks}
                  tick={AXIS_TICK}
                  width={36}
                />
                <Tooltip {...tooltipProps} />
                <Bar dataKey="count" name="Deployments" fill="#9333ea" radius={[4, 4, 0, 0]} maxBarSize={56}>
                  <LabelList dataKey="count" position="top" offset={8} {...COUNT_LABEL} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
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
                  <th className="p-3 text-left">Applicant ID</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Position</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentApplicants.map((row) => (
                  <tr key={row.id} className="border-t">
                    <td className="p-3">{formatApplicantRef(row.id)}</td>
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
                    <td colSpan={5} className="p-6 text-center text-gray-500">
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
                    <td className="p-3">
                      <div>{formatApplicantRef(row.applicantId)}</div>
                      <Link href={`/applicants/${row.applicantId}`} className="text-sm text-blue-600 hover:underline">
                        {row.applicantName}
                      </Link>
                    </td>
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
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-gray-500">{subtitle}</p> : null}
      <div className="mt-4">{children}</div>
    </div>
  )
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-[340px] items-center justify-center rounded-md border border-dashed border-gray-200 bg-gray-50 px-6 text-center text-sm text-gray-500">
      {message}
    </div>
  )
}
