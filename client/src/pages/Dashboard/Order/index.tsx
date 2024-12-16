import { DashboardWrapper } from "@/components/DashboardWrapper"
import { DataTable } from "@/components/DataTable";
import { useListPrintOrders, usePrintOrderHistory } from "@/hooks/printOrder"
import { createColumns } from "@/pages/Dashboard/Order/column";
import FooterTable from "./footerTable";
import { HeaderTable } from "./headerTable";
import useCustomReactTable from "@/components/DataTable/useCustomReactTable";
import { useState } from "react";

export const OrderPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: listPrintOrders, refetch: refetchListPrintOders } = useListPrintOrders();
  const { reset } = usePrintOrderHistory();
  const columns = createColumns(refetchListPrintOders, reset);

  const table = useCustomReactTable({
    data: listPrintOrders || [],
    columns,
  });

  return (
    <DashboardWrapper title="Thanh toán đơn hàng">
      <DataTable
        table={table}
        columns={columns}
        actionLabel="Thanh toán"
        selectBehavior
        isLoading={isLoading}
        headerChildren={
          <HeaderTable />
        }
        footerChildren={
          <FooterTable
            setIsLoading={setIsLoading}
            table={table}
            actionLabel="Thanh toán"
            isLoading={isLoading}
          />
        }
      />
    </DashboardWrapper>
  )
}
