
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { Column } from "../types";

interface DataTableColumnHeaderProps<T> {
  columns: Column<T>[];
  onSort: (columnId: string) => void;
}

export function DataTableColumnHeader<T>({
  columns,
  onSort,
}: DataTableColumnHeaderProps<T>) {
  return (
    <TableHeader>
      <TableRow>
        {columns.map((column) => (
          <TableHead key={column.id} className="bg-muted/40">
            {column.sortable ? (
              <button
                className="flex items-center gap-1 hover:text-accent-foreground"
                onClick={() => onSort(column.id)}
              >
                {column.header}
                <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
              </button>
            ) : (
              column.header
            )}
          </TableHead>
        ))}
        <TableHead className="w-[80px] bg-muted/40"></TableHead>
      </TableRow>
    </TableHeader>
  );
}
