import { getPurchaseOrders } from "@/data/purchaseOrder";
import { queryKeys } from "@/utils/constant";
import { useQuery } from "@tanstack/react-query";

export const usePurchaseOrders = () => {
  return useQuery({
    queryKey: [queryKeys.purchaseOrders],
    queryFn: () => getPurchaseOrders({
      sort: "-updated_at",
      status: "PAID",
      skip: 0,
      limit: 5,
    }),
  });
}