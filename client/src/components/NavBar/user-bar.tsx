import UserNav from "../Header/UserNav";
import { useProfile } from "@/hooks/user";
import { Badge } from "@/components/ui/badge";

export default function UserBar() {
  const { data } = useProfile();
  return (
    <div className="p-5 border-b-2 flex justify-end gap-2 items-center">
      <div className="flex items-center gap-3">
        <UserNav />
        <div className="space-y-1">
        <p className="font-bold text-[15px]">{data?.username}</p>
        <Badge className="text-xs">{data?.role}</Badge>
        </div>
      </div>
    </div>
  )
}
