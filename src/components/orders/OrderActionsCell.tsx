import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Order, OrderStatus, updateOrderStatus, deleteOrder } from "@/lib/mockApi";
import { hasPermission, hasRole } from "@/lib/auth";
import { 
  MoreHorizontal, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Archive, 
  RefreshCw,
  Trash2, 
  Eye,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OrderActionsCellProps {
  order: Order;
  refresh: () => void;
}

const STATUS_ACTION_MAP: Record<string, { title: string, description: string }> = {
  'approved': {
    title: 'Approve Order',
    description: 'Are you sure you want to approve order ${orderNumber}?'
  },
  'shipped': {
    title: 'Ship Order',
    description: 'Are you sure you want to mark order ${orderNumber} as shipped?'
  },
  'closed': {
    title: 'Close Order',
    description: 'Are you sure you want to close order ${orderNumber}?'
  },
  'reopened': {
    title: 'Reopen Order',
    description: 'Are you sure you want to reopen order ${orderNumber}?'
  },
  'delete': {
    title: 'Delete Order',
    description: 'Are you sure you want to delete order ${orderNumber}? This action cannot be undone.'
  }
};

export function OrderActionsCell({ order, refresh }: OrderActionsCellProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [actionType, setActionType] = useState<OrderStatus | 'delete' | null>(null);
  const navigate = useNavigate();
  
  const canApprove = hasPermission('approve') && order.status === 'pending';
  const canShip = hasPermission('ship') && order.status === 'approved';
  const canClose = hasPermission('close') && (order.status === 'shipped' || order.status === 'approved');
  const canReopen = hasPermission('reopen') && order.status === 'closed';
  const canDelete = hasRole('admin');
  
  const handleAction = async () => {
    if (!actionType) return;
    
    try {
      setIsLoading(true);
      
      if (actionType === 'delete') {
        await deleteOrder(order.id);
        toast.success(`Order ${order.orderNumber} deleted successfully`);
      } else {
        await updateOrderStatus(order.id, actionType);
        toast.success(`Order ${order.orderNumber} status updated to ${actionType}`);
      }
      
      // Close dialog and refresh data
      setActionType(null);
      refresh();
    } catch (error) {
      console.error('Error performing action:', error);
      toast.error((error as Error).message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  const viewOrderDetails = () => {
    navigate(`/orders/${order.id}`);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuItem onClick={viewOrderDetails}>
            <Eye className="mr-2 h-4 w-4" />
            View details
          </DropdownMenuItem>
          
          {canApprove && (
            <DropdownMenuItem onClick={() => setActionType('approved')}>
              <CheckCircle className="mr-2 h-4 w-4 text-forest-500" />
              Approve
            </DropdownMenuItem>
          )}
          
          {canShip && (
            <DropdownMenuItem onClick={() => setActionType('shipped')}>
              <Truck className="mr-2 h-4 w-4 text-skyblue-500" />
              Ship
            </DropdownMenuItem>
          )}
          
          {canClose && (
            <DropdownMenuItem onClick={() => setActionType('closed')}>
              <Archive className="mr-2 h-4 w-4 text-muted-foreground" />
              Close
            </DropdownMenuItem>
          )}
          
          {canReopen && (
            <DropdownMenuItem onClick={() => setActionType('reopened')}>
              <RefreshCw className="mr-2 h-4 w-4 text-amber-500" />
              Reopen
            </DropdownMenuItem>
          )}
          
          {canDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setActionType('delete')}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Action Confirmation Dialog */}
      {actionType && (
        <Dialog open={!!actionType} onOpenChange={(open) => !open && setActionType(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{STATUS_ACTION_MAP[actionType]?.title}</DialogTitle>
              <DialogDescription>
                {STATUS_ACTION_MAP[actionType]?.description}
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter className="gap-2 sm:gap-0">
              <DialogClose asChild>
                <Button variant="outline" disabled={isLoading}>Cancel</Button>
              </DialogClose>
              <Button 
                onClick={handleAction} 
                disabled={isLoading}
                variant={actionType === 'delete' ? 'destructive' : 'default'}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {actionType === 'approved' && 'Approve'}
                    {actionType === 'shipped' && 'Ship'}
                    {actionType === 'closed' && 'Close'}
                    {actionType === 'reopened' && 'Reopen'}
                    {actionType === 'delete' && 'Delete'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
