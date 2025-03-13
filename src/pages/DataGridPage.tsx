
import { useEffect, useState } from "react";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { DataTable, StatusBadge } from "@/components/data-grid/DataTable";
import { fetchGridData } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface DataItem {
  id: string;
  name: string;
  category: string;
  status: string;
  amount: number;
  date: string;
  assignee: string;
}

const DataGridPage = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetchGridData(
          currentPage,
          pageSize,
          searchQuery,
          sortBy,
          sortDirection
        );
        
        setData(response.data);
        setTotalItems(response.meta.totalItems);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchQuery, sortBy, sortDirection]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleSort = (columnId: string, direction: 'asc' | 'desc') => {
    setSortBy(columnId);
    setSortDirection(direction);
    setCurrentPage(1); // Reset to first page on sort
  };

  const columns = [
    {
      id: "name",
      header: "Name",
      accessorKey: "name" as keyof DataItem,
      sortable: true,
    },
    {
      id: "category",
      header: "Category",
      accessorKey: "category" as keyof DataItem,
      sortable: true,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status" as keyof DataItem,
      sortable: true,
      cell: (item: DataItem) => <StatusBadge status={item.status} />,
    },
    {
      id: "amount",
      header: "Amount",
      accessorKey: "amount" as keyof DataItem,
      sortable: true,
      cell: (item: DataItem) => <span>${item.amount.toFixed(2)}</span>,
    },
    {
      id: "date",
      header: "Date",
      accessorKey: "date" as keyof DataItem,
      sortable: true,
      cell: (item: DataItem) => {
        const date = new Date(item.date);
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit'
        }).format(date);
      },
    },
    {
      id: "assignee",
      header: "Assignee",
      accessorKey: "assignee" as keyof DataItem,
      sortable: true,
    },
  ];

  return (
    <SidebarLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Grid</h1>
          <p className="text-muted-foreground mt-1">
            Manage and explore your business data
          </p>
        </div>
        
        <div className="animate-fade-in">
          {isLoading && data.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={data}
              isLoading={isLoading}
              currentPage={currentPage}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onSearch={handleSearch}
              onSort={handleSort}
              title="Product Data"
              description="View and manage your inventory data"
            />
          )}
        </div>
      </div>
    </SidebarLayout>
  );
};

export default DataGridPage;
