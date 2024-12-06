import { DashboardWrapper } from "@/components/DashboardWrapper"
import { DataTable } from "@/components/DataTable";
import { useListPrintOrders, usePrintOrderHistory } from "@/hooks/printOrder"
import { createColumns } from "@/pages/Dashboard/Order/column";
import { useProfile } from "@/hooks/user";
import { paymentOrder } from "@/action/printOrder";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { Link } from "react-router-dom"
import { paths } from "@/utils/path"
import { CirclePlus } from "lucide-react"
import { Button } from "@/components/ui/button";

export const OrderPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: listPrintOrders, refetch: refetchListPrintOders } = useListPrintOrders();
  const { data: profile, refetch: refetchProfile } = useProfile();
  const { refetch: refetchPrintOrderHistory } = usePrintOrderHistory();
  const columns = createColumns(refetchListPrintOders, refetchPrintOrderHistory);
  const handlePayment = async (selectedIds: number[]) => {
    // Handle payment logic here
    setIsLoading(true);
    const result = await paymentOrder(selectedIds);
    if (result.data) {
      await refetchListPrintOders();
      await refetchProfile();
      await refetchPrintOrderHistory();
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
    setIsLoading(false);
    // console.log("Processing payment for IDs:", selectedIds)
  };
  return (
    <DashboardWrapper title="Thanh toán đơn hàng">
      <DataTable
        columns={columns}
        data={listPrintOrders || []}
        onAction={handlePayment}
        actionLabel="Thanh toán"
        selectBehavior
        isLoading={isLoading}
        balance={profile?.balance}
      >
        <div className="flex items-center mb-5 gap-2">
          <div
            className="text-primary px-6 py-3 flex items-center bg-gray-100 rounded-lg"
          >
            <p className="text-sm pr-3">Số trang khả dụng</p>
            <span className="border-l-2 border-primary pl-2">{profile?.balance}</span>
          </div>
          <Link to={paths.Purchase}>
            <Button className="rounded-full px-6 py-5 text-green-500 border-green-500 hover:bg-green-500 hover:text-white" variant="outline">
              <CirclePlus /> Mua thêm trang in
            </Button>
          </Link>
        </div>
      </DataTable>
    </DashboardWrapper>
  )
}
