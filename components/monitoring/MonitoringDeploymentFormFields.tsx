import { fieldClassSm, formGridClass, labelClassSm, sectionTitleClassSm } from "@/lib/form-ui"

type MonitoringData = Record<string, unknown>

type Props = {
  data: MonitoringData
}

function formatValue(value: unknown): string {
  return value != null && value !== "" ? String(value) : ""
}

export function MonitoringDeploymentFormFields({ data }: Props) {
  return (
    <div>
      <h2 className={sectionTitleClassSm}>Deployment Details</h2>
      <div className={formGridClass}>
        <div>
          <label className={labelClassSm}>Deployment Status</label>
          <select
            name="deployment_status"
            defaultValue={formatValue(data.deployment_status) || "Deployed"}
            className={fieldClassSm}
          >
            <option value="Deployed">Deployed</option>
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
          <input
            name="salary_amount"
            defaultValue={formatValue(data.salary_amount)}
            className={fieldClassSm}
            placeholder="Ex: 1500 SAR"
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
