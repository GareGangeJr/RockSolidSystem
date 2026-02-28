import { deleteApplicant } from "@/app/(app)/applicants/actions"
import { Trash } from "lucide-react"

export default function DeleteApplicantButton({ id }: { id: number }) {
  return (
    <form action={deleteApplicant}>
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
