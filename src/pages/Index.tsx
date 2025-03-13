
import { useEffect, useState } from "react";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkflowCard, WorkflowItem } from "@/components/workflow/WorkflowCard";
import { Button } from "@/components/ui/button";
import { PlusCircle, ChevronRight, BarChart3, Users, Clock } from "lucide-react";
import { StatusBadge } from "@/components/data-grid/DataTable";
import { fetchGridData, fetchWorkflows } from "@/lib/api";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeProcesses: 0,
    completedProcesses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [workflowsRes, dataRes] = await Promise.all([
          fetchWorkflows(1, 3),
          fetchGridData(1, 10)
        ]);
        
        setWorkflows(workflowsRes.data);
        
        // Calculate stats from the data
        setStats({
          totalUsers: 23,
          activeProcesses: workflowsRes.data.filter(w => 
            w.status === "pending" || w.status === "review"
          ).length,
          completedProcesses: workflowsRes.data.filter(w => 
            w.status === "approved" || w.status === "rejected"
          ).length,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleWorkflowApprove = (id: string) => {
    setWorkflows(prev => 
      prev.map(workflow => 
        workflow.id === id ? { ...workflow, status: "approved" } : workflow
      )
    );
  };

  const handleWorkflowReject = (id: string) => {
    setWorkflows(prev => 
      prev.map(workflow => 
        workflow.id === id ? { ...workflow, status: "rejected" } : workflow
      )
    );
  };

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

  const cardClasses = "glass-panel animate-fade-in";
  const statsCardClasses = cn(
    cardClasses,
    "flex flex-col justify-between h-full"
  );

  return (
    <SidebarLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, here's what's happening today.
            </p>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Workflow
          </Button>
        </div>

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

        <div className="grid gap-4 md:grid-cols-7">
          <Card className={cn(cardClasses, "md:col-span-4")} style={{ animationDelay: '400ms' }}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Pending Workflows</CardTitle>
                <Button variant="ghost" size="sm" className="gap-1">
                  View all
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                Recent workflows requiring your action
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflows
                  .filter(w => w.status === "pending" || w.status === "review")
                  .slice(0, 2)
                  .map((workflow, index) => (
                    <WorkflowCard
                      key={workflow.id}
                      workflow={workflow}
                      onApprove={handleWorkflowApprove}
                      onReject={handleWorkflowReject}
                    />
                  ))}
                {workflows.filter(w => w.status === "pending" || w.status === "review").length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    No pending workflows requiring your attention
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className={cn(cardClasses, "md:col-span-3")} style={{ animationDelay: '500ms' }}>
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
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Dashboard;
