import authorizedAxiosInstance from "@/lib/axios";
import { type UploadDocumentResponse } from "@/types/document";
import { AxiosError } from "axios";

export const handleUploadDocument = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const result = await authorizedAxiosInstance.post<UploadDocumentResponse>(
      "/documents/upload",
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return {
      data: result.data.data,
      message: result.data.message,
    };
  } catch (error) {
    if (error instanceof AxiosError)
      return {
        data: null,
        message: error.response?.data.message,
      };
  }
  return {
    data: null,
    message: null,
  };
};

export const handleDeleteDocument = async (ids: string[]) => {
  try {
    const result = await authorizedAxiosInstance.delete("/documents", {
      data: { ids },
    });
    return {
      data: result.data.data,
      message: result.data.message,
    };
  } catch (error) {
    if (error instanceof AxiosError)
      return {
        data: null,
        message: error.response?.data.message,
      };
  }
  return {
    data: null,
    message: null,
  };
}
