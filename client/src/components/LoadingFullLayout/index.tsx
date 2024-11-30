import { Skeleton } from "@/components/ui/skeleton"

export const LoadingFullLayout = () => {
  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-3 w-full p-5">
      <Skeleton className="rounded-xl" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-[50%] rounded-xl" />
        <Skeleton className="h-[50%] rounded-xl" />
      </div>
      <Skeleton className="rounded-xl row-span-2" />
      <Skeleton className="rounded-xl col-span-2" />
    </div>
  )
}
