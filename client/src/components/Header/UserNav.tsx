import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function UserNav() {
  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarFallback>CN</AvatarFallback>
        <AvatarImage src="https://github.com/shadcn.png" />
      </Avatar>
    </div>
  );
}
