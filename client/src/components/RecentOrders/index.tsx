import { useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"
import { usePurchaseOrders } from "@/hooks/purchaseOrder"
import { LoadingFullLayout } from "@/components/LoadingFullLayout";
import ErrorPage from "@/components/Error";
import { formatCurrency } from "@/helpers/format";

export function RecentOders() {
  const { data, isLoading, isError } = usePurchaseOrders();
  if (isLoading) return <LoadingFullLayout/>
  if (isError) return <ErrorPage/>

  return (
    <div className="space-y-8">
      {
        data?.map((order, index) => (
          <div key={index} className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-9 w-9">
                {order.user.avatar ?  <AvatarImage src={order.user.avatar.url} alt="Avatar" />
                : <AvatarImage src={`/avatars/0${index+1}.png`} alt="Avatar" />}
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{order.user.username}</p>
                <p className="text-sm text-muted-foreground">{order.user.email}</p>
              </div>
            </div>
            <div className="font-medium">+{formatCurrency(order.price)}</div>
          </div>
        ))
      }
    </div>
  )
}