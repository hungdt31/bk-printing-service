import { Link } from "react-router-dom";
import { paths } from "@/utils/path";
import UserNav from "./UserNav";
import { DropdownMenuDemo } from "./Menu";
import { useProfile } from "@/hooks/user";
import { Button } from "@/components/ui/button";
import Options from "./Options";
import Logo from "../Logo";


export default function Header() {
  const { isError, isFetching } = useProfile();
  if (isFetching)
    return <div className="py-5 px-3">Đang cập nhật phiên đăng nhập...</div>;
  return (
    <div className="flex items-center justify-between border-b-[1px] shadow-md py-5 px-3 w-full bg-white z-50">
      <Logo />
      <Options />
      <>
        {isError ? (
          <Link to={paths.Login}>
            <Button>Đăng nhập</Button>
          </Link>
        ) : (
          <div className="flex gap-5 lg:pr-11 sm:pr-7 pr-3">
            <UserNav />
            <DropdownMenuDemo />
          </div>
        )}
      </>
    </div>
  );
}
