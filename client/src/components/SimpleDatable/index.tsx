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
import { LoadingFullLayout } from "../LoadingFullLayout"

import { cn } from "@/lib/utils"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onAction?: (selectedIds: number[]) => void
  actionLabel?: string
  selectBehavior?: boolean
  balance?: number
  isLoading?: boolean
  variant?: 'main' | 'sub' | 'none'
  children?: React.ReactNode
}

export function SimpleDataTable<TData, TValue>({
  columns,
  data,
  onAction,
  actionLabel = "Xử lý",
  selectBehavior = false,
  balance = 0,
  isLoading = false,
  variant = 'main',
  children,
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
      {children}
      <div className={cn("border-2 rounded-lg shadow-sm", variant == 'main'
        ? "border-primary/80" :
        variant == 'sub' ? "border-gray-500" : '')}>
        <Table >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className={cn("font-bold py-4", variant == 'main' ? "text-primary border-b-primary border-b-2" :
                      variant == 'sub' ? "text-gray-500 border-b-gray-500 border-b-2" : '')}>
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
        <div className="flex items-center justify-center text-sm font-medium mr-5">
          Trang {table.getState().pagination.pageIndex + 1} / {" "}
          {table.getPageCount()}
        </div>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      <div className="flex items-center justify-between">
        {selectBehavior ? <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div> : <div className="flex-1 text-sm text-muted-foreground">{table.getFilteredRowModel().rows.length} kết quả</div>}

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
      </div>
    </>
  )
}