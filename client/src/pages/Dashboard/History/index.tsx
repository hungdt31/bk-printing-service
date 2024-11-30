import { DashboardWrapper } from "@/components/DashboardWrapper"
import { DataTable } from "@/components/DataTable"
import { usePrintOrderHistory } from "@/hooks/printOrder"
import { columns } from "@/pages/Dashboard/History/column"
import { LoadingFullLayout } from "@/components/LoadingFullLayout"
import ErrorPage from "@/components/Error"

export const HistoryLog = () => {
  const { data, isPending, isError } = usePrintOrderHistory();
  if (isPending) return <LoadingFullLayout/>;
  if (isError) return <ErrorPage/>;
  return (
    <DashboardWrapper
      title="Nhật ký in ấn của người dùng"
    >
      <DataTable columns={columns} data={data} />
    </DashboardWrapper>
  )
}
