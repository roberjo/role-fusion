import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  ArrowUpDown,
  MoreHorizontal,
  Loader2
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

export interface Column<T> {
  id: string;
  header: string;
  accessorKey: keyof T;
  sortable?: boolean;
  cell?: (item: T) => React.ReactNode;
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
  
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (onSort) {
      const initialSortColumn = columns.find(col => col.sortable)?.id || null;
      if (initialSortColumn) {
        setSortColumn(initialSortColumn);
      }
    }
  }, [columns, onSort]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleSort = (columnId: string) => {
    const newDirection = 
      sortColumn === columnId && sortDirection === 'asc' ? 'desc' : 'asc';
    
    setSortColumn(columnId);
    setSortDirection(newDirection);
    
    if (onSort) {
      onSort(columnId, newDirection);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const [animateRows, setAnimateRows] = useState(false);
  
  useEffect(() => {
    setAnimateRows(true);
    const timer = setTimeout(() => {
      setAnimateRows(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [data]);

  return (
    <Card className="w-full glass-panel">
      {title && (
        <CardHeader className="pb-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle>{title}</CardTitle>
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            <form onSubmit={handleSearch} className="max-w-sm">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-8 pr-4 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>
        </CardHeader>
      )}
      <CardContent className="p-6">
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column.id} className="bg-muted/40">
                      {column.sortable ? (
                        <button
                          className="flex items-center gap-1 hover:text-accent-foreground"
                          onClick={() => handleSort(column.id)}
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
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                      <div className="flex justify-center items-center h-full">
                        <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
                        <span className="ml-2">Loading data...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                      No results found
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row, idx) => (
                    <TableRow 
                      key={row.id.toString()}
                      className={cn(
                        animateRows ? "animate-fade-in" : "",
                        "transition-colors hover:bg-muted/40",
                        idx % 2 === 0 ? "bg-background" : "bg-muted/20"
                      )}
                      style={{ 
                        animationDelay: `${idx * 30}ms`,
                        animationFillMode: 'both' 
                      }}
                    >
                      {columns.map((column) => (
                        <TableCell key={`${row.id}-${column.id}`}>
                          {column.cell ? column.cell(row) : row[column.accessorKey] as React.ReactNode}
                        </TableCell>
                      ))}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            {data.length > 0 ? (
              <>
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, totalItems)} of {totalItems} results
              </>
            ) : (
              "No results"
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1 || isLoading}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <div className="text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages || isLoading}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      "active": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      "pending": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
      "inactive": "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100",
      "approved": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      "rejected": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
      "review": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    };
    
    return statusMap[status.toLowerCase()] || "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100";
  };
  
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
      getStatusColor(status)
    )}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
