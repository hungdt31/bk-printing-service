import UploadCard from '@/components/UploadCard'
import { DashboardWrapper } from '@/components/DashboardWrapper'
import { useMyDocuments } from '@/hooks/document'
import { Document } from '@/types/document'
import FileCard from '@/components/FileCard'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from 'react'
import { Trash2, X } from 'lucide-react'
import { Checkbox } from "@/components/ui/checkbox"
import { handleDeleteDocument } from '@/action/document'
import { toast } from 'react-toastify'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/utils/constant'
import { cn } from '@/lib/utils'
import { DialogTitle } from '@radix-ui/react-dialog'
import { ArrowUpFromLine } from 'lucide-react'
import { LoadingFullLayout } from '@/components/LoadingFullLayout'
import ErrorPage from '@/components/Error'

export const OrderPage = () => {
  const { data, isPending, isError } = useMyDocuments();
  const [isSelecting, setIsSelecting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleToggleSelect = async () => {
    if (isSelecting) {
      setIsDeleting(true);
      const result = await handleDeleteDocument(selectedIds);
      if (result.data) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: [queryKeys.documents] });
      } else {
        toast.error(result.message);
      }
      setIsDeleting(false);
    };
    setIsSelecting(!isSelecting);
    setSelectedIds([]);
  };

  const handleSelectDocument = (documentId: string) => {
    setSelectedIds(prev =>
      prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  if (isPending) return <LoadingFullLayout/>;
  if (isError) return <ErrorPage/>;

  return (
    <DashboardWrapper title="Danh sách tài liệu">
      <>
        <div className='flex items-center gap-3 py-5'>
          {!isSelecting && (
            <Dialog>
              <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white px-6 py-5"
              >
                <ArrowUpFromLine /> <p className="text-sm">Tải lên tài liệu</p>
              </Button>
              </DialogTrigger>
              <DialogTitle></DialogTitle>
              <DialogContent>
                <UploadCard />
              </DialogContent>
            </Dialog>
          )}
          <div className="flex items-center gap-2">
            <Button
              variant="destructive"
              onClick={handleToggleSelect}
              className="flex items-center gap-2 text-destructive border-destructive bg-white hover:bg-destructive hover:text-white border-2 px-6 py-5"
              disabled={isDeleting}
            >
              {isSelecting ? (
                <>
                  <Trash2 className="h-4 w-4" />
                  <span>Xóa ({selectedIds.length})</span>
                </>
              ) : (
                "Xóa tài liệu"
              )}
            </Button>
            {isSelecting && (
              <Button
                variant="outline"
                onClick={() => {
                  setIsSelecting(false)
                  setSelectedIds([])
                }}
                disabled={isDeleting}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                <span>Thoát</span>
              </Button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item: Document) => (
            <div key={item.document_id} className={cn("relative", isDeleting && "opacity-50")}>
              {isSelecting && (
                <div className="absolute top-[20%] -left-2 z-10">
                  <Checkbox
                    disabled={isDeleting}
                    checked={selectedIds.includes(item.document_id)}
                    onCheckedChange={() => handleSelectDocument(item.document_id)}
                    className="h-5 w-5 border-2 bg-white border-primary/50 rounded-full"
                  />
                </div>
              )}
              <div className={`${selectedIds.includes(item.document_id) ? 'ring-2 ring-primary rounded-lg' : ''
                }`}>
                <FileCard document={item} />
              </div>
            </div>
          ))}
        </div>
      </>
    </DashboardWrapper>
  )
}
