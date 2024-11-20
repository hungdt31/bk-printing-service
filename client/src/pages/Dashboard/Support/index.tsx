import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const SupportPage = () => {
  return (
    <Card className="w-full m-3">
      <CardHeader>
        <CardTitle className="font-bold text-xl">FAQ</CardTitle>
        <CardDescription>Xem các thông tin sau về chúng tôi</CardDescription>
      </CardHeader>
    </Card>
  )
}
