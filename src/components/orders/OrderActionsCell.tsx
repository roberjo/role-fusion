import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { hasPermission } from "@/lib/auth";
import { Permission } from "@/lib/constants";
import { Order, OrderStatus } from "@/lib/mockApi";
import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

const STATUS_ACTION_MAP: Record<OrderStatus, Permission> = {
  PENDING: "approve",
  APPROVED: "ship",
  SHIPPED: "close",
  CLOSED: "reopen",
  REOPENED: "close",
  REJECTED: "approve",
} as const;

interface OrderActionsCellProps {
  row: {
    original: Order;
  };
}

export function OrderActionsCell({ row }: OrderActionsCellProps) {
  const navigate = useNavigate();
  const { id, status } = row.original;
  const nextAction = STATUS_ACTION_MAP[status];

  const canUpdate = hasPermission("update");
  const canDelete = hasPermission("delete");
  const canPerformNextAction = hasPermission(nextAction);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {canUpdate && (
          <DropdownMenuItem onClick={() => navigate(`/orders/${id}`)}>
            View details
          </DropdownMenuItem>
        )}
        {canPerformNextAction && (
          <DropdownMenuItem
            onClick={() => {
              // Handle next action based on status
              console.log(`Performing ${nextAction} on order ${id}`);
            }}
          >
            {nextAction.charAt(0).toUpperCase() + nextAction.slice(1)}
          </DropdownMenuItem>
        )}
        {canDelete && (
          <DropdownMenuItem
            className="text-red-600 dark:text-red-400"
            onClick={() => {
              // Handle delete
              console.log(`Deleting order ${id}`);
            }}
          >
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
