import { useState, useEffect } from "react";
import { Table } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { DataTableHeader } from "./table/DataTableHeader";
import { DataTableBody } from "./table/DataTableBody";
import { DataTableColumnHeader } from "./table/DataTableColumnHeader";
import { DataTablePagination } from "./table/DataTablePagination";
import { Column } from "./types";
import { StatusBadge } from "./StatusBadge";

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  totalItems?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onSearch?: (query: string) => void;
  onSort?: (columnId: string, direction: 'asc' | 'desc') => void;
  currentPage?: number;
  title?: string;
  description?: string;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  isLoading = false,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onSearch,
  onSort,
  currentPage = 1,
  title,
  description
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [animateRows, setAnimateRows] = useState(false);
  
  useEffect(() => {
    if (onSort) {
      const initialSortColumn = columns.find(col => col.sortable)?.id || null;
      if (initialSortColumn) {
        setSortColumn(initialSortColumn);
      }
    }
  }, [columns, onSort]);

  useEffect(() => {
    setAnimateRows(true);
    const timer = setTimeout(() => {
      setAnimateRows(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [data]);

  const handleSort = (columnId: string) => {
    const newDirection = 
      sortColumn === columnId && sortDirection === 'asc' ? 'desc' : 'asc';
    
    setSortColumn(columnId);
    setSortDirection(newDirection);
    
    if (onSort) {
      onSort(columnId, newDirection);
    }
  };

  const handleSearch = (query: string) => {
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <Card className="w-full glass-panel">
      <DataTableHeader
        title={title}
        description={description}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />
      <CardContent className="p-6">
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <DataTableColumnHeader
                columns={columns}
                onSort={handleSort}
              />
              <DataTableBody
                data={data}
                columns={columns}
                isLoading={isLoading}
                animateRows={animateRows}
              />
            </Table>
          </div>
        </div>
        
        <DataTablePagination
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          isLoading={isLoading}
          onPageChange={onPageChange || (() => {})}
        />
      </CardContent>
    </Card>
  );
}

export { StatusBadge };
export type { Column };
