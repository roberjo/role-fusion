
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const WorkflowEditorPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    if (!title) {
      toast.error("Please enter a workflow title");
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Workflow created successfully");
      navigate("/workflows");
    }, 1000);
  };

  const handleCancel = () => {
    navigate("/workflows");
  };

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Workflow</h1>
          <p className="text-muted-foreground mt-1">
            Define your workflow details and requirements
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Workflow Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter workflow title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter workflow description"
                className="min-h-[100px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user-1">User 1</SelectItem>
                  <SelectItem value="user-2">User 2</SelectItem>
                  <SelectItem value="user-3">User 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Initial Status</Label>
              <div className="px-4 py-3 rounded-md bg-muted/40">
                <p className="text-sm font-medium">Pending</p>
                <p className="text-xs text-muted-foreground mt-1">
                  All new workflows start with Pending status
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Creating..." : "Create Workflow"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </SidebarLayout>
  );
};

export default WorkflowEditorPage;
