
import { useEffect, useState } from "react";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { DataTable } from "@/components/data-grid/DataTable";
import { fetchOrders, Order, OrderStatus } from "@/lib/mockApi";
import { hasPermission } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/data-grid/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrderActionsCell } from "@/components/orders/OrderActionsCell";
import { useNavigate } from "react-router-dom";

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentTab, setCurrentTab] = useState<OrderStatus | 'all'>('all');
  const pageSize = 10;
  const { toast } = useToast();
  const navigate = useNavigate();
  const canCreateOrders = hasPermission('create');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        const response = await fetchOrders(
          currentPage,
          pageSize,
          currentTab === 'all' ? undefined : currentTab,
          searchQuery,
          sortBy,
          sortDirection
        );
        
        setOrders(response.data);
        setTotalItems(response.meta.totalItems);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Error",
          description: "Failed to load orders. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [currentPage, searchQuery, sortBy, sortDirection, currentTab, toast]);

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

  const handleCreateOrder = () => {
    navigate("/orders/new");
  };

  const columns = [
    {
      id: "orderNumber",
      header: "Order #",
      accessorKey: "orderNumber" as keyof Order,
      sortable: true,
    },
    {
      id: "customerName",
      header: "Customer",
      accessorKey: "customerName" as keyof Order,
      sortable: true,
    },
    {
      id: "totalAmount",
      header: "Total",
      accessorKey: "totalAmount" as keyof Order,
      sortable: true,
      cell: (item: Order) => <span>${item.totalAmount.toFixed(2)}</span>,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status" as keyof Order,
      sortable: true,
      cell: (item: Order) => <StatusBadge status={item.status} />,
    },
    {
      id: "createdAt",
      header: "Created",
      accessorKey: "createdAt" as keyof Order,
      sortable: true,
      cell: (item: Order) => {
        const date = new Date(item.createdAt);
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit'
        }).format(date);
      },
    },
    {
      id: "actions",
      header: "Actions",
      accessorKey: "id" as keyof Order,
      sortable: false,
      cell: (item: Order) => <OrderActionsCell order={item} refresh={() => {
        // Refresh the orders list after an action
        const loadOrders = async () => {
          try {
            setIsLoading(true);
            const response = await fetchOrders(
              currentPage,
              pageSize,
              currentTab === 'all' ? undefined : currentTab,
              searchQuery,
              sortBy,
              sortDirection
            );
            
            setOrders(response.data);
            setTotalItems(response.meta.totalItems);
          } finally {
            setIsLoading(false);
          }
        };
        
        loadOrders();
      }} />,
    }
  ];

  return (
    <SidebarLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track customer orders
            </p>
          </div>
          {canCreateOrders && (
            <Button onClick={handleCreateOrder}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Order
            </Button>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Tabs 
            defaultValue="all" 
            className="w-full" 
            value={currentTab}
            onValueChange={(value) => {
              setCurrentTab(value as OrderStatus | 'all');
              setCurrentPage(1);
            }}
          >
            <TabsList className="grid grid-cols-6 w-full sm:w-[600px]">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
              <TabsTrigger value="reopened">Reopened</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search orders..."
                className="pl-8 pr-4 w-full sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup 
                  value={`${sortBy}-${sortDirection}`}
                  onValueChange={(value) => {
                    const [field, direction] = value.split('-');
                    setSortBy(field);
                    setSortDirection(direction as 'asc' | 'desc');
                  }}
                >
                  <DropdownMenuRadioItem value="createdAt-desc">Newest first</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="createdAt-asc">Oldest first</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="totalAmount-desc">Amount (high to low)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="totalAmount-asc">Amount (low to high)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="orderNumber-asc">Order # (A-Z)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="orderNumber-desc">Order # (Z-A)</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="animate-fade-in">
          {isLoading && orders.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={orders}
              isLoading={isLoading}
              currentPage={currentPage}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onSearch={handleSearch}
              onSort={handleSort}
              title="Order Management"
              description="View and manage customer orders"
            />
          )}
        </div>
      </div>
    </SidebarLayout>
  );
};

export default OrdersPage;
