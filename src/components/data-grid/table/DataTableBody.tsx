
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTableRowActions } from "./DataTableRowActions";
import { Column } from "../types";

interface DataTableBodyProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading: boolean;
  animateRows: boolean;
}

export function DataTableBody<T extends { id: string | number }>({
  data,
  columns,
  isLoading,
  animateRows,
}: DataTableBodyProps<T>) {
  if (isLoading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={columns.length + 1} className="h-24 text-center">
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
              <span className="ml-2">Loading data...</span>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  if (data.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={columns.length + 1} className="h-24 text-center">
            No results found
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {data.map((row, idx) => (
        <TableRow
          key={row.id.toString()}
          className={cn(
            animateRows ? "animate-fade-in" : "",
            "transition-colors",
            idx % 2 === 0 
              ? "bg-background" 
              : "bg-muted/20"
          )}
          style={{
            animationDelay: `${idx * 30}ms`,
            animationFillMode: "both",
          }}
        >
          {columns.map((column) => (
            <TableCell key={`${row.id}-${column.id}`}>
              {column.cell ? column.cell(row) : row[column.accessorKey] as React.ReactNode}
            </TableCell>
          ))}
          <TableCell className="text-right">
            <DataTableRowActions />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
