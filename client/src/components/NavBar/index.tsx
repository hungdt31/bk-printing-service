import Logo from "../Logo"
import { navbar } from "@/utils/constant"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
export default function NavBar() {
  // shadow-[4px_0_5px_-2px_rgba(0,0,0,0.2)]
  return (
    <div className="w-[15%] min-w-[200px] border-r-2 border-b-2">
      <div className="p-5">
      <Logo/>
      </div>
      <div className="flex flex-col">
      {
        navbar.map((item, index) => (
          <Link to={item.path} key={index} className={cn(
            item.path === window.location.pathname ? "text-primary bg-secondary border-r-4 border-primary" : "",
            "p-3 font-semibold flex items-center gap-3"
          )}>
            <item.icon/> {item.name}
          </Link>
        ))
      }
      </div>
    </div>
  )
}
