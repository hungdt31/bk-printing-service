import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
export default function AdminWrapper({
  children,
  title,
}: {
  children: React.ReactNode,
  title: string,
}) {
  return (
    <div className="w-full h-full bg-white p-5">
      <Card className="h-full overflow-auto animate-in zoom-in-95 duration-300 fade-in">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  )
}
