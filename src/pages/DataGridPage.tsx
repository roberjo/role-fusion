import { useEffect, useState } from "react";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { DataTable, StatusBadge } from "@/components/data-grid/DataTable";
import { Loader2 } from "lucide-react";
import { fetchOrders } from "@/lib/mockApi";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface OrderData {
  id: string;
  orderNumber: string;
  customerName: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

const DataGridPage = () => {
  const [data, setData] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetchOrders(
          currentPage,
          pageSize,
          undefined,
          searchQuery,
          sortBy,
          sortDirection
        );
        
        const mappedData = response.data.map(order => ({
          id: order.id,
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          status: order.status,
          totalAmount: order.totalAmount,
          createdAt: order.createdAt,
          items: order.items
        }));
        
        setData(mappedData);
        setTotalItems(response.meta.totalItems);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data. Please try again.");
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
    setCurrentPage(1);
  };

  const handleSort = (columnId: string, direction: 'asc' | 'desc') => {
    setSortBy(columnId);
    setSortDirection(direction);
    setCurrentPage(1);
  };

  const columns = [
    {
      id: "orderNumber",
      header: "Order #",
      accessorKey: "orderNumber" as keyof OrderData,
      sortable: true,
    },
    {
      id: "customerName",
      header: "Customer",
      accessorKey: "customerName" as keyof OrderData,
      sortable: true,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status" as keyof OrderData,
      sortable: true,
      cell: (item: OrderData) => <StatusBadge status={item.status} />,
    },
    {
      id: "totalAmount",
      header: "Amount",
      accessorKey: "totalAmount" as keyof OrderData,
      sortable: true,
      cell: (item: OrderData) => <span>${item.totalAmount.toFixed(2)}</span>,
    },
    {
      id: "createdAt",
      header: "Date",
      accessorKey: "createdAt" as keyof OrderData,
      sortable: true,
      cell: (item: OrderData) => {
        const date = new Date(item.createdAt);
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit'
        }).format(date);
      },
    },
    {
      id: "items",
      header: "Items",
      accessorKey: "items" as keyof OrderData,
      sortable: false,
      cell: (item: OrderData) => <span>{item.items.length} products</span>,
    },
  ];

  return (
    <SidebarLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders Grid</h1>
          <p className="text-muted-foreground mt-1">
            Manage and explore your order data
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
              title="Order Data"
              description="View and manage your customer orders"
            />
          )}
        </div>
      </div>
    </SidebarLayout>
  );
};

export default DataGridPage;
