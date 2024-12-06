import AdminWrapper from '@/components/AdminWrapper';
import { useAdminStatistic } from '@/hooks/statistic';
import { FiPrinter } from 'react-icons/fi';
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { ProfileStatisticCard } from '@/components/ProfileStatisticCard';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Overview } from '@/components/Overview';
import { RecentOders } from '@/components/RecentOrders';
import { Badge } from '@/components/ui/badge';

export default function AdminPage() {
  const { data: adminStatistic } = useAdminStatistic();
  return (
    <AdminWrapper title="Trang chủ">
      <div className='flex flex-col gap-4'>
        <div className="grid sm:grid-cols-3 grid-cols-1 gap-4">
          <ProfileStatisticCard
            title="Tổng số trang đã in"
            value={Number(adminStatistic?.pages.currentMonthPagesConsumed) || 0}
            percentageChange={Number(adminStatistic?.pages.percentageChange) || 0}
            icon={FiPrinter}
            iconClassName="bg-blue-50 text-blue-500"
          />
          <ProfileStatisticCard
            title="Doanh thu"
            value={Number(adminStatistic?.purchaseOrders.amount) || 0}
            percentageChange={Number(adminStatistic?.purchaseOrders.percentageChange) || 0}
            icon={FaMoneyCheckDollar}
            isCurrency={true}
            iconClassName="bg-yellow-50 text-yellow-500"
          />
          <ProfileStatisticCard
            title="Tổng đơn hàng"
            value={Number(adminStatistic?.printOrders.currentMonthCount) || 0}
            percentageChange={Number(adminStatistic?.printOrders.percentageChange) || 0}
            icon={BiSolidPurchaseTag}
            iconClassName="bg-green-50 text-green-500"
          />
        </div>
        <div className='grid sm:grid-cols-3 gap-4'>
          <Card className='sm:col-span-2'>
            <CardHeader>
              <CardTitle className='font-bold text-center'>Biểu đồ doanh thu</CardTitle>
            </CardHeader>
            <CardContent>
              <Overview />
            </CardContent>
          </Card>
          <Card className='sm:col-span-1'>
            <CardHeader>
              <CardTitle className='font-bold flex justify-between'>Mua thêm trang in <Badge>latest</Badge></CardTitle>
            </CardHeader>
            <CardContent>
              <RecentOders />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminWrapper>
  );
}
