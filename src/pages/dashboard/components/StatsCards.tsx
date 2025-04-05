
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardsProps {
  stats: {
    totalUsers: number;
    activeProcesses: number;
    completedProcesses: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cardClasses = "glass-panel animate-fade-in";
  const statsCardClasses = cn(
    cardClasses,
    "flex flex-col justify-between h-full"
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className={statsCardClasses} style={{ animationDelay: '0ms' }}>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">
            Total Users
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            +2 new users this week
          </p>
        </CardContent>
      </Card>
      <Card className={statsCardClasses} style={{ animationDelay: '100ms' }}>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">
            Active Processes
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeProcesses}</div>
          <p className="text-xs text-muted-foreground">
            {stats.activeProcesses} pending approval
          </p>
        </CardContent>
      </Card>
      <Card className={statsCardClasses} style={{ animationDelay: '200ms' }}>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">
            Completed Processes
          </CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completedProcesses}</div>
          <p className="text-xs text-muted-foreground">
            +{stats.activeProcesses} projected soon
          </p>
        </CardContent>
      </Card>
      <Card className={statsCardClasses} style={{ animationDelay: '300ms' }}>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">
            System Health
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">100%</div>
          <p className="text-xs text-muted-foreground">
            All systems operational
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
