
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { StatusBadge } from "@/components/data-grid/DataTable";
import { Loader2, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface WorkflowItem {
  id: string;
  title: string;
  description: string;
  status: string;
  assignee: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  progress: number;
  steps: number;
  currentStep: number;
  createdAt: string;
  updatedAt: string;
}

interface WorkflowCardProps {
  workflow: WorkflowItem;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function WorkflowCard({ workflow, onApprove, onReject }: WorkflowCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(workflow.status);
  const { toast } = useToast();

  const handleApprove = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus("approved");
      toast({
        title: "Workflow approved",
        description: `The workflow "${workflow.title}" has been approved.`,
      });
      if (onApprove) onApprove(workflow.id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve workflow.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus("rejected");
      toast({
        title: "Workflow rejected",
        description: `The workflow "${workflow.title}" has been rejected.`,
      });
      if (onReject) onReject(workflow.id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject workflow.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Card className="glass-panel transition-all duration-350 hover:shadow-elevated">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{workflow.title}</CardTitle>
            <CardDescription className="mt-1">
              Created on {formatDate(workflow.createdAt)}
            </CardDescription>
          </div>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{workflow.description}</p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{workflow.progress}%</span>
          </div>
          
          <Progress value={workflow.progress} className="h-2" />
          
          <div className="flex justify-between text-sm mt-2">
            <span>Step {workflow.currentStep} of {workflow.steps}</span>
            <span className="text-muted-foreground">
              Last updated: {formatDate(workflow.updatedAt)}
            </span>
          </div>
        </div>
        
        <div className="mt-6 flex items-center">
          <div className="flex-shrink-0 mr-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={workflow.assignee.avatarUrl || '/placeholder.svg'} />
              <AvatarFallback>{workflow.assignee.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <p className="text-sm font-medium">Assigned to</p>
            <p className="text-sm text-muted-foreground">{workflow.assignee.name}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className={cn(
        "flex gap-3",
        status === "pending" || status === "review" ? "justify-between" : "justify-end"
      )}>
        {(status === "pending" || status === "review") && (
          <>
            <Button 
              variant="outline" 
              onClick={handleReject}
              disabled={isLoading}
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 flex-1"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </>
              )}
            </Button>
            <Button 
              onClick={handleApprove}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Approve
                </>
              )}
            </Button>
          </>
        )}
        <Button variant="ghost" size="sm" className="ml-auto">
          View Details <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
