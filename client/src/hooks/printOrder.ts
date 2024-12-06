import { useQuery, useMutation } from "@tanstack/react-query";
import { getHistoryPrintOrders, getListPrintOrders, getPrintOrdersByAdmin } from "@/data/printOrder";
import { queryKeys } from "@/utils/constant";

export const usePrintOrderHistory = () => {
  return useQuery({
    queryKey: [queryKeys.printOrderHistory],
    queryFn: getHistoryPrintOrders,
    refetchOnMount: false, // không refetch khi component mount
    retry: false, // nếu không muốn retry khi có lỗi
  });
};

export const useListPrintOrders = () => {
  return useQuery({
    queryKey: [queryKeys.listPrintOrders],
    queryFn: getListPrintOrders,
    refetchOnMount: false, // không refetch khi component mount
    retry: false, // nếu không muốn retry khi có lỗi
  });
};

export const usePrintOrdersByAdmin = () => {
  return useMutation({
    mutationKey: [queryKeys.listPrintOrdersByAdmin],
    mutationFn: getPrintOrdersByAdmin
  })
}

