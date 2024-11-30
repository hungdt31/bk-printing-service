import { DashboardWrapper } from "@/components/DashboardWrapper";
import { paths } from "@/utils/path";
import { useDocumentById } from "@/hooks/document";
import { localStorageKeys } from "@/utils/constant";
import { SettingsForm } from "@/components/SettingsForm";
import { useProfile } from "@/hooks/user";
import { LoadingFullLayout } from "@/components/LoadingFullLayout";
import ErrorPage from "@/components/Error";
export const OrderSettings = () => {
  const documentId = parseInt(window.localStorage.getItem(localStorageKeys.documentId) || '1');
  const { data, isPending, isError } = useDocumentById(documentId);
  const { data: profile } = useProfile();
  if (isPending) return <LoadingFullLayout/>;
  if (isError) return <ErrorPage/>;
  return(
    <DashboardWrapper title="Thiết lập thông số bản in" hrefBack={paths.Order}>
      {data ? (
        <div className="h-full grid sm:grid-cols-2 w-full gap-3 grid-cols-1">
          <div className="overflow-hidden space-y-2">
            <h4>Bản xem trước</h4>
            <embed type={data.mimetype} src={data.url} className="w-full h-full"/>
          </div>
          <div className="border-l-2 pl-5 border-black space-y-2">
            <h4 className="text-center">Thông số bản in</h4>
            <SettingsForm documentId={documentId} page_count={data.page_count} balance={profile?.balance || 0} />
          </div>
        </div>
      ) : <div>Không tìm thấy tài liệu</div>
      }
    </DashboardWrapper>
  );
};
