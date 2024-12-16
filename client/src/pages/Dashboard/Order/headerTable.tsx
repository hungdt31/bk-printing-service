import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { paths } from '@/utils/path'
import { CirclePlus } from 'lucide-react'
import { useProfile } from '@/hooks/user'

export const HeaderTable = () => {
  const { data: profile, isLoading, isError } = useProfile();
  if (isLoading || isError) return null;
  return (
    <div className="flex items-center mb-5 gap-2">
      <div
        className="text-primary px-6 py-3 flex items-center bg-gray-100 rounded-lg"
      >
        <p className="text-sm pr-3">Số trang khả dụng</p>
        <span className="border-l-2 border-primary pl-2">{profile?.balance}</span>
      </div>
      <Link to={paths.Purchase}>
        <Button className="rounded-full px-6 py-5 text-green-500 border-green-500 hover:bg-green-500 hover:text-white" variant="outline">
          <CirclePlus /> Mua thêm trang in
        </Button>
      </Link>
    </div>
  )
}
