import Logo from "../Logo"
import { navbar } from "@/utils/constant"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { handleLogout } from "@/action/logout"
import { LogOut } from "lucide-react"
import { useProfile } from "@/hooks/user"
import toast from "react-hot-toast"

export default function NavBar() {
  const { refetch } = useProfile();
  // shadow-[4px_0_5px_-2px_rgba(0,0,0,0.2)]
  return (
    <div className="w-[15%] min-w-[200px] border-r-2 border-b-2">
      <div className="p-5">
        <Logo />
      </div>
      <div className="flex flex-col">
        {
          navbar.map((item, index) => (
            <Link to={item.path} key={index} className={cn(
              window.location.pathname.includes(item.path) ? "text-primary bg-secondary border-r-4 border-primary font-bold" : "font-semibold",
              "p-3 flex items-center gap-3"
            )}>
              <item.icon /> {item.name}
            </Link>
          ))
        }
        <button
          onClick={() => {
            handleLogout().then(async (result) => {
              if (result.data) {
                await refetch();
                toast.success(result.data.message);
              }
            });
          }}
          className="p-3 text-destructive hover:text-destructive/90 flex items-center gap-3 bg-red-50 font-semibold"
        >
          <LogOut size={15} /> Đăng xuất
        </button>
      </div>
    </div>
  )
}
