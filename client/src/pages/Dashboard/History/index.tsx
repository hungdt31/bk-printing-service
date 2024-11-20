import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const HistoryLog = () => {
  return (
    <Card className="w-full m-3">
      <CardHeader>
        <CardTitle className="font-bold text-xl">Lịch sử in</CardTitle>
        <CardDescription>Nhật ký in ấn của sinh viên</CardDescription>
      </CardHeader>
    </Card>
  )
}
