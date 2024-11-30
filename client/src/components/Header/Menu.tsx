import { User, LogOut } from "lucide-react";
import { RiMenuFold2Fill } from "react-icons/ri";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { paths } from "@/utils/path";
import { LucideProps } from "lucide-react";
import { handleLogout } from "@/action/logout";
import { useProfile } from "@/hooks/user";
import { CircleHelp } from "lucide-react";
import { SubHeader } from "@/utils/constant";
import { useWindowWidth } from "@react-hook/window-size";
import { cn } from "@/lib/utils";

interface DropdownMenuLinkItemProps {
  to: string; // Đường dẫn
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >; // Biểu tượng (component React)
  label: string; // Nhãn hiển thị
  color?: string;
  func?: () => void;
}

const DropdownMenuLinkItem: React.FC<DropdownMenuLinkItemProps> = ({
  to,
  icon: Icon,
  label,
  color,
  func,
}) => (
  <DropdownMenuItem>
    {func ? (
      <button
        onClick={func}
        className="flex items-center gap-3 w-full"
        style={{ color: color ? color : "inherit" }}
      >
        <Icon size={20} />
        <span>{label}</span>
      </button>
    ) : (
      <Link
        to={to}
        className="flex items-center gap-3 w-full"
        style={{ color: color ? color : "inherit" }}
      >
        <Icon size={20} />
        <span>{label}</span>
      </Link>
    )}
  </DropdownMenuItem>
);

export function DropdownMenuDemo() {
  const { data, refetch } = useProfile();
  const width = useWindowWidth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <RiMenuFold2Fill fontSize={28} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-3">
        <DropdownMenuLabel className="text-center">
          Xin chào, <span className="text-primary">{data?.username}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLinkItem
            to={paths.Profile}
            icon={User}
            label="Thông tin cá nhân"
          />
          <DropdownMenuLinkItem
            to={paths.Support}
            icon={CircleHelp}
            label="Hỗ trợ"
          />
        </DropdownMenuGroup>
        <div className={
          cn(width < 768 ? "" : "hidden")
        }>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {
              SubHeader.map((op, index) => (
                <DropdownMenuLinkItem
                  key={index}
                  to={op.path}
                  icon={op.icon}
                  label={op.name}
                />
              ))
            }
          </DropdownMenuGroup>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuLinkItem
          to={paths.SignupPage}
          icon={LogOut}
          label="Đăng xuất"
          color="red"
          func={() => {
            handleLogout().then(async (result) => {
              if (result.data) {
                await refetch();
              }
            });
          }}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
