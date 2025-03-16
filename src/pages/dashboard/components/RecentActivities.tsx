
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
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
    <Card className={cn("glass-panel animate-fade-in md:col-span-3")} style={{ animationDelay: '500ms' }}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Recent Activity</CardTitle>
          <Button variant="ghost" size="sm" className="gap-1">
            View all
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity, i) => (
            <div 
              key={activity.id} 
              className={cn(
                "flex items-start p-3 rounded-lg",
                i % 2 === 0 ? "bg-muted/40" : ""
              )}
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <StatusBadge status={activity.status} />
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
