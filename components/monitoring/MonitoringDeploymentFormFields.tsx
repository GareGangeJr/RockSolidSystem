import { fieldClassSm, formGridClass, labelClassSm, sectionTitleClassSm } from "@/lib/form-ui"
import { formatMonitoringDateForInput } from "@/lib/monitoring-sync"
import { NumericInput } from "@/components/shared/NumericInput"

type MonitoringData = Record<string, unknown>

type Props = {
  data: MonitoringData
  hasOpenConcern?: boolean
}

function formatValue(value: unknown): string {
  return value != null && value !== "" ? String(value) : ""
}

export function MonitoringDeploymentFormFields({ data, hasOpenConcern = false }: Props) {
  const currentStatus = formatValue(data.deployment_status) || "Deployed"

  return (
    <div>
      <h2 className={sectionTitleClassSm}>Deployment Details</h2>
      <div className={formGridClass}>
        <div>
          <label className={labelClassSm}>Departure Date</label>
          <input
            name="deployment_date"
            type="date"
            defaultValue={formatMonitoringDateForInput(data.deployment_date)}
            className={fieldClassSm}
          />
        </div>
        <div>
          <label className={labelClassSm}>Deployment Status</label>
          <select
            name="deployment_status"
            defaultValue={hasOpenConcern ? "Deployed(With Concerns)" : currentStatus}
            className={fieldClassSm}
          >
            <option value="Deployed" disabled={hasOpenConcern}>
              Deployed
            </option>
            <option value="Deployed(With Concerns)">Deployed(With Concerns)</option>
          </select>
        </div>
        <div>
          <label className={labelClassSm}>Employer Name</label>
          <input name="employer_name" defaultValue={formatValue(data.employer_name)} className={fieldClassSm} />
        </div>
        <div>
          <label className={labelClassSm}>Contract Duration</label>
          <input
            name="contract_duration"
            defaultValue={formatValue(data.contract_duration)}
            className={fieldClassSm}
            placeholder="Ex: 2 years"
          />
        </div>
        <div>
          <label className={labelClassSm}>Salary Amount</label>
          <NumericInput
            name="salary_amount"
            allowDecimal
            defaultValue={formatValue(data.salary_amount)}
            className={fieldClassSm}
            placeholder="Ex: 1500"
          />
        </div>
        <div>
          <label className={labelClassSm}>Welfare Officer Assigned</label>
          <input name="welfare_officer" defaultValue={formatValue(data.welfare_officer)} className={fieldClassSm} />
        </div>
      </div>
    </div>
  )
}
