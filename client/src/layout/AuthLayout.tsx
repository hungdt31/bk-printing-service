import { Outlet, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { REDIRECT_IF_AUTHENTICATED } from "@/utils/path";
import { useProfile } from "@/hooks/user";
import { paths } from "@/utils/path";

export const AuthLayout = () => {
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();
  const { data, isError, isLoading } = useProfile();

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    // Attach scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Redirect if not authenticated
    if (!isLoading && data && !isError) {
      navigate(REDIRECT_IF_AUTHENTICATED);
    }

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [data, isError, isLoading, navigate]);

  return (
    <div
      style={{
        backgroundImage: `url("background.png")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover"
      }}
      className="flex flex-col gap-3 min-h-screen">
      <div className={cn(scrollY > 100 ? "fixed top-0 right-0 left-0" : "")}>
        <div className="flex items-center justify-between border-b-[1px] shadow-md py-5 px-3 w-full bg-white">
          <Link to={paths.Home} className="flex items-center gap-3">
            <img src="logo.png" width={50} height={50} />
            <h2 className="line-clamp-1">SSPS</h2>
          </Link>
        </div>
      </div>
      <Outlet />
      <Toaster />
    </div>
  );
};
