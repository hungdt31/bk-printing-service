import { queryKeys } from "@/utils/constant";
import { useQuery } from "@tanstack/react-query";
import { getMyDocuments, getDocumentById } from "@/data/document";

export const useMyDocuments = () => {
  return useQuery({
    queryKey: [queryKeys.documents],
    queryFn: getMyDocuments,
    refetchOnMount: false, // không refetch khi component mount
    retry: false, // nếu không muốn retry khi có lỗi
  });
};

export const useDocumentById = (id: number) => {
  return useQuery({
    queryKey: [queryKeys.documentById, id],
    queryFn: () => getDocumentById(id),
  });
};
