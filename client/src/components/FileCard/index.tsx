import { Document } from "@/types/document"
import { formatDate, formatFileSize } from "@/utils/constant"
import { iconFiles } from "@/utils/constant"
import { FaPrint } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { paths } from "@/utils/path";
import { useNavigate } from "react-router-dom";
import { localStorageKeys } from "@/utils/constant";

export default function FileCard({ document }: { document: Document }) {
  const navigate = useNavigate();
  const Icon = iconFiles.find((item) => item.type === document.mimetype)?.icon
  const color = iconFiles.find((item) => item.type === document.mimetype)?.color
  return (
    <div className="flex items-center gap-2 rounded-lg p-4 border">
      {Icon && <Icon size={30} className={color} />}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="flex flex-col gap-0 items-start grow">
            <a href={document.url} target="_blank" className="break-words whitespace-normal line-clamp-1">{document.filename}</a>
            <div className="text-sm text-gray-500 font-medium">{formatFileSize(document.size)}</div>
          </TooltipTrigger>
          <TooltipContent>
            <div>Tạo lúc: {formatDate(document.created_at)}</div>
            <div>Cập nhật lúc: {formatDate(document.updated_at)}</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <button 
      onClick={() => {
        window.localStorage.setItem(localStorageKeys.documentId, document.document_id.toString());
        navigate(paths.OrderSettings)
      }}
      className="border-l-2 border-gray-200 pl-4">
        <FaPrint size={20} />
      </button>
    </div>
  )
}