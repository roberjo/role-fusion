import { useEffect, useState } from "react";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { WorkflowCard, WorkflowItem } from "@/components/workflow/WorkflowCard";
import { mockWorkflows } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, PlusCircle, Filter } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [filteredWorkflows, setFilteredWorkflows] = useState<WorkflowItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [sort, setSort] = useState("newest");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setWorkflows(mockWorkflows.data);
      } catch (error) {
        console.error("Error fetching workflows:", error);
        toast({
          title: "Error loading workflows",
          description: "Could not load workflow data. Using mock data instead.",
          variant: "destructive",
        });
        setWorkflows(mockWorkflows.data);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  useEffect(() => {
    let filtered = [...workflows];
    
    if (currentTab !== "all") {
      filtered = filtered.filter(workflow => workflow.status === currentTab);
    }
    
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(workflow => 
        workflow.title.toLowerCase().includes(query) || 
        workflow.description.toLowerCase().includes(query) ||
        workflow.assignee.name.toLowerCase().includes(query)
      );
    }
    
    filtered.sort((a, b) => {
      if (sort === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sort === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sort === "progress-high") {
        return b.progress - a.progress;
      } else if (sort === "progress-low") {
        return a.progress - b.progress;
      }
      return 0;
    });
    
    setFilteredWorkflows(filtered);
  }, [workflows, currentTab, searchQuery, sort]);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleCreateWorkflow = () => {
    navigate("/workflow-editor");
    toast({
      title: "New workflow",
      description: "Creating a new workflow...",
    });
  };

  const statusCounts = {
    all: workflows.length,
    pending: workflows.filter(w => w.status === "pending").length,
    review: workflows.filter(w => w.status === "review").length,
    approved: workflows.filter(w => w.status === "approved").length,
    rejected: workflows.filter(w => w.status === "rejected").length,
  };

  return (
    <SidebarLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track your business processes
            </p>
          </div>
          <Button onClick={handleCreateWorkflow}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Workflow
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Tabs 
            defaultValue="all" 
            className="w-full" 
            value={currentTab}
            onValueChange={setCurrentTab}
          >
            <TabsList className="grid grid-cols-5 w-full sm:w-[600px]">
              <TabsTrigger value="all">
                All
                <span className="ml-1 text-xs">({statusCounts.all})</span>
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending
                <span className="ml-1 text-xs">({statusCounts.pending})</span>
              </TabsTrigger>
              <TabsTrigger value="review">
                In Review
                <span className="ml-1 text-xs">({statusCounts.review})</span>
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved
                <span className="ml-1 text-xs">({statusCounts.approved})</span>
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected
                <span className="ml-1 text-xs">({statusCounts.rejected})</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex gap-2">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search workflows..."
                className="pl-8 pr-4 w-full sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                  <DropdownMenuRadioItem value="newest">Newest first</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="oldest">Oldest first</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="progress-high">Progress (high to low)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="progress-low">Progress (low to high)</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredWorkflows.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-lg">
            <h3 className="text-xl font-medium">No workflows found</h3>
            <p className="text-muted-foreground mt-2">
              {searchQuery 
                ? "Try adjusting your search or filters" 
                : "Create a new workflow to get started"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredWorkflows.map((workflow, idx) => (
              <div 
                key={workflow.id}
                className="animate-fade-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <WorkflowCard
                  workflow={workflow}
                  onApprove={handleWorkflowApprove}
                  onReject={handleWorkflowReject}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
