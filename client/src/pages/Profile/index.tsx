// import { useAppSelector } from "@/hooks";
// import { RootState } from "@/hooks/store";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";

export const Profile = () => {
  // const { data: profile } = useAppSelector((state: RootState) => state.profile);
  const { data, isError, isFetching } = useProfile();
  if (isFetching) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error fetching profile</div>;
  }
  return (
    <div className="px-3 flex justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-xl text-primary">
            Thông tin cá nhân
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3">
              <Button variant={"secondary"} className="min-w-[100px]">
                Họ và tên
              </Button>
              <span>{data?.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant={"secondary"} className="min-w-[100px]">
                Email
              </Button>
              <span>{data?.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant={"secondary"} className="min-w-[100px]">
                Vai trò
              </Button>
              <span>{data?.type}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
