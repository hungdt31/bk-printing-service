import { generateReport } from "@/data/report";
import { queryKeys } from "@/utils/constant";
import { useMutation } from "@tanstack/react-query";

export const useGenerateReport = () => {
  return useMutation({
    mutationKey: [queryKeys.generateReport],
    mutationFn: ({ year, month }: { year: number; month?: number }) =>
      generateReport({ year, month }),
  });
};
