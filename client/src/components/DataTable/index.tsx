"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import React from "react"
import { PrintOrder } from "@/types/printOrder"
import { CirclePlus } from "lucide-react"
import { LoadingFullLayout } from "../LoadingFullLayout"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onAction?: (selectedIds: number[]) => void
  actionLabel?: string
  selectBehavior?: boolean
  balance?: number
  isLoading?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onAction,
  actionLabel = "Xử lý",
  selectBehavior = false,
  balance = 0,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  })
  const totalPagesConsumed = table.getFilteredSelectedRowModel().rows.reduce((acc, row) => acc + (row.original as PrintOrder).num_pages_consumed, 0);
  const handleAction = () => {
    const selectedIds = table.getFilteredSelectedRowModel().rows.map(
      (row) => (row.original as PrintOrder).print_id
    )
    onAction?.(selectedIds)
  }

  return (
    <>
      {balance !== 0 && <div className="flex items-center mb-5 gap-2">
        <Button
          variant="outline"
          className="border-primary text-primary hover:bg-primary hover:text-white px-6 py-5"
        >
          <p className="text-sm">Số trang khả dụng</p>
          <span className="border-l-2 border-primary pl-2">{balance}</span>
        </Button>
        <Button className="rounded-full px-6 py-5 text-green-500 border-green-500 hover:bg-green-500 hover:text-white" variant="outline">
          <CirclePlus /> Mua thêm {totalPagesConsumed > balance ? totalPagesConsumed - balance : null} trang in
        </Button>
      </div>}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="font-bold text-primary">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {
              isLoading ? <LoadingFullLayout /> :
                table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )
            }
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      {selectBehavior && <div className="flex items-center justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        {onAction && (
          <div className="flex items-center gap-2 text-xs">
            <Button
              variant="outline"
              className="text-primary px-6 py-5"
            >
              <p className="text-sm">Tổng số trang in:</p>
              <span>{totalPagesConsumed}</span>
            </Button>
            <Button
              className="px-6 py-5"
              onClick={handleAction}
              disabled={table.getFilteredSelectedRowModel().rows.length === 0 || balance < totalPagesConsumed || isLoading}
            >
              {actionLabel}
            </Button>
          </div>
        )}
      </div>}
    </>
  )
}
