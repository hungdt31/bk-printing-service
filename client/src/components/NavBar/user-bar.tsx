import UserNav from "../Header/UserNav";
import { useProfile } from "@/hooks/useProfile";

export default function UserBar() {
  const { data } = useProfile();
  return (
    <div className="p-5 border-b-2 flex justify-end">
      <div className="flex items-center gap-3">
        <UserNav/>
        <strong>{data?.username}</strong>
      </div>
    </div>
  )
}
