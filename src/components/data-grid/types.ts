
export interface Column<T> {
  id: string;
  header: string;
  accessorKey: keyof T;
  sortable?: boolean;
  cell?: (item: T) => React.ReactNode;
}
