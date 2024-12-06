import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/constant";
import { getPrinters } from "@/data/printer";

export const usePrinter = () => {
  return useQuery({
    queryKey: [queryKeys.printers],
    queryFn: getPrinters,
  });
};
