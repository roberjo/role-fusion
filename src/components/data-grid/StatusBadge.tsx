
import { cn } from "@/lib/utils";

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
