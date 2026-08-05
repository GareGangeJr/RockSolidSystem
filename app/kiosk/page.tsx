import Image from "next/image"
import AttendanceClock from "@/components/AttendanceClock"

export default function KioskPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-6">
      <Image src="/logo123.png" alt="Rock Solid Logo" width={112} height={112} className="mb-4 w-28" priority />
      <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
      <p className="mb-8 text-sm text-gray-500">Office time in / time out</p>
      <AttendanceClock resetAfterSave />
    </main>
  )
}
