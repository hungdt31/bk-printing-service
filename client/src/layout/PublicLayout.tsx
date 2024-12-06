import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";
import { useProfile } from "@/hooks/user";
import { useNavigate } from "react-router-dom";
import { role } from "@/utils/constant";
import { paths } from "@/utils/path";

export const PublicLayout = () => {
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();
  const { data: profile, isLoading, isError } = useProfile();

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    // Chỉ redirect khi có profile và role là ADMIN
    if (!isLoading && !isError && profile && profile.role === role.ADMIN) {
      navigate(paths.Admin, { replace: true });
    }
  }, [profile, isLoading, isError, navigate]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <div className={cn(scrollY > 100 ? "fixed top-0 right-0 left-0" : "")}>
        <Header />
      </div>
      <Outlet />
      <Footer />
      <Toaster />
    </div>
  );
};
