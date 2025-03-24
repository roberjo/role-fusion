import { cn } from "@/lib/utils";
import { STATUS_COLORS } from "@/lib/constants";

export type StatusType = keyof typeof STATUS_COLORS;

interface StatusBadgeProps {
  status: StatusType | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    return STATUS_COLORS[status.toLowerCase() as StatusType] || STATUS_COLORS.inactive;
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
