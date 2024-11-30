import { PrintOrderRequest } from '@/types/printOrder'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PrinterCheck } from "lucide-react"
import { toast } from "react-hot-toast"
import { createOrder } from '@/action/printOrder'
import { useState } from 'react'
import PulseLoader from "react-spinners/PulseLoader";
import { useProfile } from '@/hooks/user'
import { usePrintOrderHistory } from '@/hooks/printOrder'
import { useNavigate } from 'react-router-dom'
import { paths } from '@/utils/path'

interface OrderCardProps {
  order: PrintOrderRequest,
  disabled: boolean
}

export default function OrderCard({
  order,
  disabled = false
}: OrderCardProps) {
  const { refetch: refetchPrintOrderHistory } = usePrintOrderHistory();
  const { refetch: refetchProfile } = useProfile();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const handlePrintOrder = async () => {
    // await createOrder(order);
    // await refetch();
    // navigate(paths.printOrder);
    setIsLoading(true);
    order.status = "PROGRESS";
    order.printer_id = parseInt(order.printer_id as unknown as string);
    // console.log(order);
    const result = await createOrder(order);
    if (result.data) {
      await refetchPrintOrderHistory();
      await refetchProfile();
      navigate(paths.Order);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    };
    setIsLoading(false);
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          disabled={disabled}
          variant="outline"
          className="border-primary text-primary hover:bg-primary hover:text-white px-6 py-5"
        >
          <PrinterCheck className="w-4 h-4 mr-2" />
          <span className="border-l-2 border-primary pl-2">Thực hiện in</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Xác nhận in</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn thực hiện đơn hàng này không?
          </DialogDescription>
        </DialogHeader>
        {
          isLoading ? (
            <div className="flex justify-center">
              <PulseLoader color="#2563EB" />
            </div>
          ) : (
            <DialogFooter className='gap-2'>
              <DialogClose><Button type="button" variant="outline">Hủy</Button></DialogClose>
              <Button type="button" onClick={handlePrintOrder}>Đồng ý</Button>
            </DialogFooter>
          )
        }
      </DialogContent>
    </Dialog>
  )
}
