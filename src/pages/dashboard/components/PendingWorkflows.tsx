
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { WorkflowCard, WorkflowItem } from "@/components/workflow/WorkflowCard";

interface PendingWorkflowsProps {
  workflows: WorkflowItem[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function PendingWorkflows({ workflows, onApprove, onReject }: PendingWorkflowsProps) {
  const pendingWorkflows = workflows.filter(w => w.status === "pending" || w.status === "review");
  
  return (
    <Card className="glass-panel animate-fade-in md:col-span-4" style={{ animationDelay: '400ms' }}>
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
          {pendingWorkflows.slice(0, 2).map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onApprove={onApprove}
              onReject={onReject}
            />
          ))}
          {pendingWorkflows.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              No pending workflows requiring your attention
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
