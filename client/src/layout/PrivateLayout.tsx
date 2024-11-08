import { Outlet, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { REDIRECT_IF_NOT_AUTHENTICATED } from "@/utils/path";
import { useProfile } from "@/hooks/useProfile";

export const PrivateLayout = () => {
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();
  const { data, isError } = useProfile();

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    // Attach scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Redirect if not authenticated
    if (!data || isError) {
      navigate(REDIRECT_IF_NOT_AUTHENTICATED);
    }

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [data, isError]);

  return (
    <div className="flex flex-col gap-3 min-h-[1500px]">
      <div className={cn(scrollY > 100 ? "fixed top-0 right-0 left-0" : "")}>
        <Header />
      </div>
      <Outlet />
      <Toaster />
    </div>
  );
};
