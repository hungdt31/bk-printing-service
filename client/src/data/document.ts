import authorizedAxiosInstance from "@/lib/axios";
import { type DocumentArrayResponse, type UploadDocumentResponse } from "@/types/document";

export const getMyDocuments = async () => {
  const response = await authorizedAxiosInstance.get<DocumentArrayResponse>("/documents/me");
  return response.data.data;
};

export const getDocumentById = async (id: number) => {
  const response = await authorizedAxiosInstance.get<UploadDocumentResponse>(`/documents/${id}`);
  return response.data.data;
};
