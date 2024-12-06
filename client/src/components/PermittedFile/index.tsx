import { Button } from '@/components/ui/button'
import { CirclePlus, X, Ellipsis, Check } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Collapsible, CollapsibleContent } from '@radix-ui/react-collapsible'
import { cn } from '@/lib/utils'
import { Checkbox } from '../ui/checkbox'
import toast from 'react-hot-toast'

interface PermittedFileProps {
  selectedFile: string[];
  setSelectedFile: (file: string[]) => void;
  disabledButton: boolean;
}

export default function PermittedFile({
  selectedFile,
  setSelectedFile,
  disabledButton
}: PermittedFileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [isDelete, setIsDelete] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const handleDelete = () => {
    setSelectedFile(selectedFile.filter((_, index) => !selectedItems.has(index)))
    setSelectedItems(new Set())
    setIsDelete(false)
  }

  const handleAdd = () => {
    // Add file type
    if (ref.current) {
      const newFileType = ref.current.value;
      if (newFileType) {
        setSelectedFile([...selectedFile, newFileType]);
        ref.current.value = '';
        toast.success('Thêm loại file thành công');
      }
    }
  }

  useEffect(() => {
    if (disabledButton) {
      setIsDelete(false);
      setIsAdd(false);
    }
  },[disabledButton])

  return (
    <Collapsible
      open={true}
      className="space-y-2"
    >
      <div className="flex items-center space-x-4">
        <h4 className="text-sm font-semibold bg-gray-500 text-white rounded-t-md p-3">
          Các loại file được chấp nhận
        </h4>
        <div className="border-b-2 border-gray-500 grow flex items-center gap-2 justify-between">
          <div className='flex items-center gap-2'>
            <Button 
              disabled={disabledButton}
              size="sm" 
              className="rounded-none shadow-lg rounded-tr-lg" 
              variant={isAdd ? "default" : "secondary"}
              type='button'
              onClick={() => setIsAdd(prev => !prev)}
            >
              <CirclePlus className="w-4 h-4" />
            </Button>
            <Button
              disabled={disabledButton}
              size="sm"
              className={cn('rounded-none shadow-lg rounded-tr-lg', isDelete ? 'bg-red-500 text-white hover:bg-red-500' : '')}
              variant="secondary"
              type='button'
              onClick={() => 
                setIsDelete(prev => !prev)
              }
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          {(isDelete || isAdd) &&
          <div className='flex items-center gap-2'>
            {isDelete &&
            <Button
              size="sm" className="rounded-none shadow-lg text-red-500" variant="secondary" type='button'
              onClick={handleDelete}
            >
              Xóa
            </Button>
          }
            <Button
              size="sm" className="rounded-none shadow-lg" variant="secondary" type='button'
              onClick={() => {
                if (isDelete) setIsDelete(false);
                if (isAdd) setIsAdd(false);
              }}>
              Hủy
            </Button>
          </div>
          }
        </div>
      </div>
      <div>
        {isAdd && 
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              placeholder="Nhập loại file"
              className="border rounded-md px-3 py-2 w-1/2"
              ref={ref}
            />
            <Button 
              size="sm" 
              className="rounded-lg" 
              variant="secondary"
              type='button'
              onClick={handleAdd}
            >
              <Check className="w-4 h-4" />
            </Button>
          </div>
      }
      </div>
      <CollapsibleContent className="grid sm:grid-cols-2 gap-3">
        {
          selectedFile.slice(0, isOpen ? undefined : 4).map((file, index) => (
            <div key={index} className="rounded-md border px-4 py-3 font-mono text-sm flex items-center justify-between">
              <div>{file}</div>
              {isDelete &&
                <Checkbox
                  onCheckedChange={(checked) => {
                    const newSelectedItems = new Set(selectedItems);
                    if (checked) {
                      newSelectedItems.add(index);
                    } else {
                      newSelectedItems.delete(index);
                    }
                    setSelectedItems(newSelectedItems);
                  }}
                  checked={selectedItems.has(index)}
                  className='data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground'
                />
              }
            </div>
          ))
        }
      </CollapsibleContent>
      <Button 
        size={"sm"}
        variant={"link"}
        type='button'
        onClick={() => setIsOpen(prev => !prev)}
        className='px-3 rounded-full'
      >
        {isOpen ? "Rút gọn": <Ellipsis/>}
      </Button>
    </Collapsible>
  )
}
