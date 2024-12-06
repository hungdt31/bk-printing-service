import { Outlet } from "react-router-dom";
import { useProfile } from "@/hooks/user";
import { paths } from "@/utils/path";
import { role } from "@/utils/constant";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/AdminSidebar";
import UserNav from "@/components/Header/UserNav";
import { Button } from "@/components/ui/button";
import { handleLogout } from "@/action/logout";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingFullLayout } from "@/components/LoadingFullLayout";
import { toast } from "react-toastify";
import { Toaster } from "react-hot-toast";

export const AdminLayout = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading, refetch, isError } = useProfile();

  // console.log('AdminLayout:', { profile, isLoading });

  useEffect(() => {
    if ((profile && profile.role !== role.ADMIN) || isError) {
      // console.log('Redirecting: Not admin', { 
      //   hasProfile: !!profile, 
      //   role: profile?.role 
      // });
      navigate(paths.Home, { replace: true });
    }
  }, [profile, isLoading, isError, navigate]);

  if (isLoading) {
    return <LoadingFullLayout/>;
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="flex flex-col min-h-screen w-full">
        <div className="flex items-center justify-between w-full bg-gray-100 px-3 py-5 shadow-md">
          <SidebarTrigger />
          <div className="flex items-center gap-3">
            <UserNav />
            <p className="font-bold border-r-2 border-gray-300 pr-3">{profile?.username}</p>
            <Button variant="secondary" onClick={() => {
              handleLogout().then(async (result) => {
                if (result.data) {
                  await refetch();
                  toast.success(result.data.message);
                }
              });
            }}>Đăng xuất</Button>
          </div>
        </div>
        <div className="grow">
          <Outlet />
        </div>
        <Toaster />
      </main>
    </SidebarProvider>
  );
};
