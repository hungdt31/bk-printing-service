"use client"

import {
  ColumnDef,
  flexRender,
  Table as TableType,
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
import { LoadingFullLayout } from "../LoadingFullLayout"
import { cn } from "@/lib/utils"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  onAction?: (selectedIds: number[]) => void
  actionLabel?: string
  selectBehavior?: boolean
  isLoading?: boolean
  variant?: 'main' | 'sub' | 'none'
  headerChildren?: React.ReactNode
  footerChildren?: React.ReactNode
  table: TableType<TData>
}

export function DataTable<TData, TValue>({
  columns,
  selectBehavior = false,
  isLoading = false,
  variant = 'main',
  headerChildren,
  footerChildren,
  table
}: DataTableProps<TData, TValue>) {
  return (
    <>
      {headerChildren}
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
      <div className="flex items-center justify-between gap-3">
        {
          selectBehavior &&
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
        }
        {footerChildren}
      </div>
    </>
  )
}
