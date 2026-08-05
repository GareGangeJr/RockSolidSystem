import { MonitoringDeploymentFormFields } from "@/components/monitoring/MonitoringDeploymentFormFields"

type MonitoringData = Record<string, unknown>

type Props = {
  data: MonitoringData
  hasOpenConcern?: boolean
}

export function MonitoringFormFields({ data, hasOpenConcern }: Props) {
  return (
    <div className="space-y-6">
      <MonitoringDeploymentFormFields data={data} hasOpenConcern={hasOpenConcern} />
    </div>
  )
}
