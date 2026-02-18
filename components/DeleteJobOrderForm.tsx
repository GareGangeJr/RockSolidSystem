import { deleteJobOrder } from "@/app/(app)/job-orders/actions"
import { Trash } from "lucide-react"

export default function DeleteJobOrderForm({ id }: { id: number }) {
  return (
    <form action={deleteJobOrder}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="p-1 rounded-md text-black hover:bg-red-100 hover:text-red-600"
        title="Delete"
      >
        <Trash className="w-4 h-4" />
      </button>
    </form>
  )
}
