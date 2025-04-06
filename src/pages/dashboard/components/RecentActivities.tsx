import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Clock } from "lucide-react";
import { StatusBadge } from "@/components/data-grid/DataTable";
import { cn } from "@/lib/utils";

export function RecentActivities() {
  const recentActivities = [
    {
      id: "act1",
      title: "Data report generated",
      description: "Monthly financial data report was generated",
      time: "2 hours ago",
      status: "completed"
    },
    {
      id: "act2",
      title: "New user registered",
      description: "James Smith created a new account",
      time: "5 hours ago",
      status: "completed"
    },
    {
      id: "act3",
      title: "System maintenance",
      description: "Scheduled system update and maintenance",
      time: "Yesterday",
      status: "completed"
    }
  ];
  
  return (
    <Card className={cn("glass-panel animate-fade-in h-full flex flex-col")} style={{ animationDelay: '400ms' }}>
      <CardHeader className="pb-2 flex-none">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription>Latest updates from your system</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="gap-1">
            View all
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4 overflow-auto">
        {recentActivities.map((activity, i) => (
          <ActivityCard 
            key={activity.id} 
            activity={activity} 
            index={i}
          />
        ))}
      </CardContent>
      <CardFooter className="flex-none flex justify-end gap-2 pt-4 border-t border-border/50">
        <Button variant="outline" size="sm">View Details</Button>
      </CardFooter>
    </Card>
  );
}

interface ActivityCardProps {
  activity: {
    id: string;
    title: string;
    description: string;
    time: string;
    status: string;
  };
  index: number;
}

function ActivityCard({ activity, index }: ActivityCardProps) {
  return (
    <Card className={cn(
      "glass-panel transition-all duration-350 hover:shadow-elevated",
      index % 2 === 0 ? "bg-muted/40" : ""
    )}>
      <CardHeader className="pb-2 flex-none">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{activity.title}</CardTitle>
            <CardDescription className="mt-1 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {activity.time}
            </CardDescription>
          </div>
          <StatusBadge status={activity.status} />
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground">{activity.description}</p>
      </CardContent>
      <CardFooter className="flex-none flex justify-end gap-2 pt-4 border-t border-border/50">footer</CardFooter>
    </Card>
  );
}
