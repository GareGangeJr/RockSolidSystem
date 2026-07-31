import { MonitoringDeploymentFormFields } from "@/components/monitoring/MonitoringDeploymentFormFields"

type MonitoringData = Record<string, unknown>

type Props = {
  data: MonitoringData
}

export function MonitoringFormFields({ data }: Props) {
  return (
    <div className="space-y-6">
      <MonitoringDeploymentFormFields data={data} />
    </div>
  )
}
