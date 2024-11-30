import { DashboardWrapper } from "@/components/DashboardWrapper"
import { DataTable } from "@/components/DataTable";
import { useListPrintOrders, usePrintOrderHistory } from "@/hooks/printOrder"
import { createColumns } from "@/pages/Dashboard/Buy/column";
import { useProfile } from "@/hooks/user";
import { paymentOrder } from "@/action/printOrder";
import { toast } from "react-hot-toast";
import { useState } from "react";

export const BuyPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: listPrintOrders, refetch: refetchListPrintOders } = useListPrintOrders();
  const { data: profile, refetch: refetchProfile } = useProfile();
  const { refetch: refetchPrintOrderHistory } = usePrintOrderHistory();
  const columns = createColumns(refetchListPrintOders);
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
        balance={profile?.balance}
        columns={columns}
        data={listPrintOrders || []}
        onAction={handlePayment}
        actionLabel="Thanh toán"
        selectBehavior
        isLoading={isLoading}
      />
    </DashboardWrapper>
  )
}
