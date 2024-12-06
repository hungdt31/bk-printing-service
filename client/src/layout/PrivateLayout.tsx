import { Outlet, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { paths, REDIRECT_IF_NOT_AUTHENTICATED } from "@/utils/path";
import { useProfile } from "@/hooks/user";
import Footer from "@/components/Footer";
import { useWindowWidth } from "@react-hook/window-size";
import NavBar from "@/components/NavBar";
import UserBar from "@/components/NavBar/user-bar";
import ErrorPage from "@/components/Error";
import { LoadingFullLayout } from "@/components/LoadingFullLayout";
import { role } from "@/utils/constant";

export const PrivateLayout = () => {
  const [scrollY, setScrollY] = useState(0);
  const width = useWindowWidth();
  const navigate = useNavigate();
  const { data, isError, isLoading } = useProfile();

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    // Attach scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Redirect if not authenticated and loading is complete
    if (!isLoading && (!data || isError)) {
      navigate(REDIRECT_IF_NOT_AUTHENTICATED);
    }
    // Redirect if role is ADMIN
    if (!isLoading && data && data.role === role.ADMIN) {
      navigate(paths.Admin);
    }

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [data, isError, isLoading, navigate]);

  // Nếu dữ liệu vẫn đang tải, có thể hiển thị loading spinner
  if (isLoading) {
    return <LoadingFullLayout/>; // Hoặc là một spinner
  }

  if (isError) {
    return <ErrorPage />;
  }

  if (width >= 768) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex grow">
          <NavBar />
          <div className="flex flex-col grow">
            <UserBar />
            <div className="flex grow">
              <Outlet />
            </div>
          </div>
        </div>
        <Toaster />
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className={cn(scrollY > 100 ? "fixed top-0 right-0 left-0" : "")}>
        <Header />
      </div>
      <div className="grow flex">
        <Outlet />
      </div>
      <Toaster />
      <Footer />
    </div>
  );
};
