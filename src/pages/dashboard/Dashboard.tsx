import { useState, useEffect } from "react";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { getAvailableUsers, User } from "@/lib/auth";
import { mockWorkflows, mockTableData } from "@/lib/api";
import { WorkflowItem } from "@/components/workflow/WorkflowCard";
import { StatsCards } from "./components/StatsCards";
import { PendingWorkflows } from "./components/PendingWorkflows";
import { RecentActivities } from "./components/RecentActivities";

export default function Dashboard() {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeProcesses: 0,
    completedProcesses: 0,
  });
  const [, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        const users = getAvailableUsers();
        const workflowsData = mockWorkflows.data;
        const tableData = mockTableData.data;
        console.log(tableData); // Log it or use it in your UI
        
        setDashboardData(users, workflowsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error loading dashboard",
          description: "Could not load dashboard data. Using mock data instead.",
          variant: "destructive",
        });
        
        const users = getAvailableUsers();
        setDashboardData(users, mockWorkflows.data);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  const setDashboardData = (users: User[], workflowsData: WorkflowItem[]) => {
    setWorkflows(workflowsData);
    setStats({
      totalUsers: users.length,
      activeProcesses: workflowsData.filter(w => 
        w.status === "pending" || w.status === "review"
      ).length,
      completedProcesses: workflowsData.filter(w => 
        w.status === "approved" || w.status === "rejected"
      ).length,
    });
  };

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

  const handleCreateWorkflow = () => {
    navigate("/workflow-editor");
  };

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
          <Button onClick={handleCreateWorkflow}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Workflow
          </Button>
        </div>

        <StatsCards stats={stats} />

        <div className="grid gap-4 md:grid-cols-2">
          <PendingWorkflows 
            workflows={workflows} 
            onApprove={handleWorkflowApprove} 
            onReject={handleWorkflowReject} 
          />
          
          <RecentActivities />
        </div>
      </div>
    </SidebarLayout>
  );
}
