
import { getCurrentUser, hasRole } from "./auth";

// Order status types
export type OrderStatus = 'pending' | 'approved' | 'shipped' | 'closed' | 'reopened';

// Order item
export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

// Order interface
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  assignedTo?: string;
  notes?: string;
  history: OrderHistory[];
}

// Order history for tracking changes
export interface OrderHistory {
  id: string;
  orderId: string;
  status: OrderStatus;
  timestamp: string;
  performedBy: string;
  notes?: string;
}

// Mock data for customers
const mockCustomers = [
  { id: 'cust-1', name: 'Acme Corp' },
  { id: 'cust-2', name: 'Globex Industries' },
  { id: 'cust-3', name: 'Smith Enterprises' },
  { id: 'cust-4', name: 'Johnson & Co' },
  { id: 'cust-5', name: 'Tech Solutions Inc' },
];

// Mock products
const mockProducts = [
  { id: 'prod-1', name: 'Premium Laptop', price: 1299.99 },
  { id: 'prod-2', name: 'Ergonomic Chair', price: 249.99 },
  { id: 'prod-3', name: 'Standing Desk', price: 499.99 },
  { id: 'prod-4', name: 'Wireless Headphones', price: 159.99 },
  { id: 'prod-5', name: 'Smart Monitor', price: 349.99 },
  { id: 'prod-6', name: 'Mechanical Keyboard', price: 129.99 },
  { id: 'prod-7', name: 'Wireless Mouse', price: 59.99 },
  { id: 'prod-8', name: 'Docking Station', price: 189.99 },
  { id: 'prod-9', name: 'External SSD', price: 159.99 },
  { id: 'prod-10', name: 'Ergonomic Footrest', price: 49.99 },
];

// Generate random order items
const generateOrderItems = (count: number) => {
  const items: OrderItem[] = [];
  const selectedProductIndices: number[] = [];
  
  while (selectedProductIndices.length < count) {
    const randomIndex = Math.floor(Math.random() * mockProducts.length);
    if (!selectedProductIndices.includes(randomIndex)) {
      selectedProductIndices.push(randomIndex);
    }
  }
  
  for (const index of selectedProductIndices) {
    const product = mockProducts[index];
    const quantity = Math.floor(Math.random() * 5) + 1;
    
    items.push({
      id: `item-${Date.now()}-${index}`,
      productName: product.name,
      quantity: quantity,
      unitPrice: product.price
    });
  }
  
  return items;
};

// Generate a random date within the last 90 days
const generateRandomDate = (daysBack: number = 90) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date.toISOString();
};

// Generate mock orders
const generateMockOrders = (count: number): Order[] => {
  const statuses: OrderStatus[] = ['pending', 'approved', 'shipped', 'closed', 'reopened'];
  
  return Array.from({ length: count }).map((_, index) => {
    const customerId = mockCustomers[Math.floor(Math.random() * mockCustomers.length)].id;
    const customerName = mockCustomers.find(c => c.id === customerId)!.name;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const createdAt = generateRandomDate();
    const items = generateOrderItems(Math.floor(Math.random() * 3) + 1);
    const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    
    return {
      id: `order-${index + 1}`,
      orderNumber: `ORD-${new Date().getFullYear()}-${10000 + index}`,
      customerId,
      customerName,
      status,
      items,
      totalAmount,
      createdAt,
      updatedAt: createdAt,
      createdBy: 'user-1',
      assignedTo: index % 3 === 0 ? 'user-2' : undefined,
      notes: index % 5 === 0 ? 'Priority order' : undefined,
      history: [
        {
          id: `history-${Date.now()}-${index}`,
          orderId: `order-${index + 1}`,
          status: 'pending',
          timestamp: createdAt,
          performedBy: 'user-1',
          notes: 'Order created'
        }
      ]
    };
  });
};

// Initial mock orders
let mockOrders: Order[] = generateMockOrders(50);

// Mock API functions with artificial delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get orders with pagination, filtering, and sorting
export const fetchOrders = async (
  page: number = 1,
  pageSize: number = 10,
  status?: OrderStatus,
  search?: string,
  sortBy: string = 'createdAt',
  sortDirection: 'asc' | 'desc' = 'desc'
): Promise<{ data: Order[], meta: { totalItems: number, totalPages: number, currentPage: number } }> => {
  await delay(500); // Simulate network delay
  
  // Filter by status if provided
  let filteredOrders = [...mockOrders];
  if (status) {
    filteredOrders = filteredOrders.filter(order => order.status === status);
  }
  
  // Search functionality
  if (search && search.trim() !== '') {
    const searchLower = search.toLowerCase();
    filteredOrders = filteredOrders.filter(order => 
      order.orderNumber.toLowerCase().includes(searchLower) ||
      order.customerName.toLowerCase().includes(searchLower) ||
      order.items.some(item => item.productName.toLowerCase().includes(searchLower))
    );
  }
  
  // Sorting
  filteredOrders.sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'orderNumber') {
      comparison = a.orderNumber.localeCompare(b.orderNumber);
    } else if (sortBy === 'customerName') {
      comparison = a.customerName.localeCompare(b.customerName);
    } else if (sortBy === 'totalAmount') {
      comparison = a.totalAmount - b.totalAmount;
    } else if (sortBy === 'status') {
      comparison = a.status.localeCompare(b.status);
    } else {
      // Default sort by createdAt
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  // Pagination
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + pageSize);
  
  return {
    data: paginatedOrders,
    meta: {
      totalItems,
      totalPages,
      currentPage: page
    }
  };
};

// Get a single order by ID
export const fetchOrderById = async (orderId: string): Promise<Order | null> => {
  await delay(300);
  return mockOrders.find(order => order.id === orderId) || null;
};

// Create a new order
export const createOrder = async (orderData: Partial<Order>): Promise<Order> => {
  await delay(800);
  
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User must be authenticated to create orders');
  }
  
  const timestamp = new Date().toISOString();
  const newOrder: Order = {
    id: `order-${Date.now()}`,
    orderNumber: `ORD-${new Date().getFullYear()}-${10000 + mockOrders.length + 1}`,
    customerId: orderData.customerId || mockCustomers[0].id,
    customerName: orderData.customerName || mockCustomers[0].name,
    status: 'pending',
    items: orderData.items || [],
    totalAmount: orderData.items ? 
      orderData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) : 0,
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy: user.id,
    notes: orderData.notes,
    history: [
      {
        id: `history-${Date.now()}`,
        orderId: `order-${Date.now()}`,
        status: 'pending',
        timestamp,
        performedBy: user.id,
        notes: 'Order created'
      }
    ]
  };
  
  mockOrders = [newOrder, ...mockOrders];
  return newOrder;
};

// Update an order's status (approval, shipping, closing, reopening)
export const updateOrderStatus = async (
  orderId: string, 
  newStatus: OrderStatus, 
  notes?: string
): Promise<Order> => {
  await delay(600);
  
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User must be authenticated to update orders');
  }
  
  // For status changes that require manager role
  if (
    (newStatus === 'approved' || newStatus === 'rejected') && 
    !hasRole('manager') && 
    !hasRole('admin')
  ) {
    throw new Error('Only managers or admins can approve or reject orders');
  }
  
  const orderIndex = mockOrders.findIndex(order => order.id === orderId);
  if (orderIndex === -1) {
    throw new Error('Order not found');
  }
  
  const timestamp = new Date().toISOString();
  const updatedOrder = {
    ...mockOrders[orderIndex],
    status: newStatus,
    updatedAt: timestamp,
    history: [
      ...mockOrders[orderIndex].history,
      {
        id: `history-${Date.now()}`,
        orderId,
        status: newStatus,
        timestamp,
        performedBy: user.id,
        notes: notes || `Order ${newStatus}`
      }
    ]
  };
  
  mockOrders[orderIndex] = updatedOrder;
  return updatedOrder;
};

// Delete an order (only admins can do this)
export const deleteOrder = async (orderId: string): Promise<boolean> => {
  await delay(700);
  
  if (!hasRole('admin')) {
    throw new Error('Only admins can delete orders');
  }
  
  const initialLength = mockOrders.length;
  mockOrders = mockOrders.filter(order => order.id !== orderId);
  
  return mockOrders.length < initialLength;
};
