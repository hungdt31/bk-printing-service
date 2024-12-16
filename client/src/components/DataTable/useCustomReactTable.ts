import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  TableOptions,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table';

export default function useCustomReactTable<TData>({
  data = [],
  columns = [],
  isPagination = false,
}: {
  data: TData[];
  columns: TableOptions<TData>['columns'];
  isPagination?: boolean;
}) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  );
  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(isPagination ? { getPaginationRowModel: getPaginationRowModel() } : {}),
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      rowSelection,
      columnFilters,
    },
  });

  return table;
}