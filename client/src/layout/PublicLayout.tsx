import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";
export const PublicLayout = () => {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

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
