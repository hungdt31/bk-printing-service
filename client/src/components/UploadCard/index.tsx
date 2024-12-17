import { LuUploadCloud } from "react-icons/lu";
import { Button } from "../ui/button";
import { SiAdguard } from "react-icons/si";
import { Link } from "react-router-dom";
import { paths } from "@/utils/path";
import { IoMdInformationCircle } from "react-icons/io";
import { iconFiles, localStorageKeys } from "@/utils/constant";
import React, { useRef, useState } from "react";
import { formatFileSize } from "@/utils/constant";
import { X, Plus } from "lucide-react";
import { handleUploadDocument } from "@/action/document";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/constant";
import { useNavigate } from "react-router-dom";

export default function UploadCard() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file) {
      setSelectedFile(file);
    }
  }

  const clearSelectedFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase() || ''
    let mimetype = ''

    switch (extension) {
      case 'pdf':
        mimetype = 'application/pdf'
        break
      case 'doc':
      case 'docx':
        mimetype = 'application/msword'
        break
      case 'jpeg':
      case 'jpg':
      case 'png':
        mimetype = 'image/jpeg'
        break
      default:
        mimetype = 'application/octet-stream'
    }

    const fileConfig = iconFiles.find(item => item.type === mimetype)
    return {
      icon: fileConfig?.icon,
      color: fileConfig?.color
    }
  }

  const uploadDocument = async () => {
    if (selectedFile) {
      setIsLoading(true)
      const result = await handleUploadDocument(selectedFile)
      if (result.data) {
        await queryClient.invalidateQueries({ queryKey: [queryKeys.documents] })
        toast.success(result.message);
        clearSelectedFile()
      } else {
        toast.error(result.message)
      }
      setIsLoading(false)
    } else {
      toast.error("Vui lòng chọn tài liệu")
    }
  }

  const createOrder = async () => {
    setIsLoading(true);
    if (selectedFile) {
      const result = await handleUploadDocument(selectedFile);
      if (result.data) {
        await queryClient.invalidateQueries({ queryKey: [queryKeys.documents] })
        window.localStorage.setItem(localStorageKeys.documentId, result.data.document_id);
        navigate(paths.OrderSettings)
      } else {
        toast.error(result.message)
      }
      setIsLoading(false);
    } else {
      toast.error("Vui lòng chọn tài liệu")
    }
  }

  return (
    <>
      <h2 className='text-center text-primary'>Tải lên tài liệu</h2>
      <div
        className='border-dashed border-2 border-gray-500 flex flex-col justify-center items-center p-5 gap-5 rounded-lg'
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {selectedFile ? (
          <div className='space-y-3'>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {getFileIcon(selectedFile.name).icon && (
                  <div className={getFileIcon(selectedFile.name).color}>
                    {React.createElement(getFileIcon(selectedFile.name).icon!, {
                      size: 30
                    })}
                  </div>
                )}
                <div className="overflow-scroll">
                  <p className="font-medium break-words whitespace-normal">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearSelectedFile}
                className="rounded-full"
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                variant="default"
                size="icon"
                onClick={uploadDocument}
                className="rounded-full"
                disabled={isLoading}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={createOrder}
              className='rounded-full border-primary text-primary bg-white border-2 hover:bg-primary hover:text-white'
              disabled={isLoading}
            >
              Tạo đơn hàng
            </Button>
          </div>
        ) : (
          <>
            <LuUploadCloud fontSize={50} />
            <div className="flex flex-col items-center">
              <p>Kéo thả tài liệu</p>
              <p>{"<hoặc>"}</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.doc,.docx, image/*"
              />
              <Button
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                Chọn tài liệu từ máy
              </Button>
            </div>
          </>
        )}
      </div>
      <div className="flex items-center gap-3">
        <SiAdguard fontSize={30} />
        <p className="text-xs">
          Your files will be securely handled by SSPS servers. <IoMdInformationCircle className="inline text-primary/50" />
          <br />By using this service, you agree to the SSPS <Link to={paths.Home} className="text-primary/50">Terms of Use</Link> and <Link to={paths.Home} className="text-primary/50">Privacy Policy.</Link>
        </p>
      </div>
    </>
  )
}
