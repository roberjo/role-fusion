import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getAvailableUsers, hasRole } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

const UsersPage = () => {
  const users = getAvailableUsers();
  const { toast } = useToast();
  const isAdmin = hasRole('ADMIN');
  
  // Add an extra layer of security - if a non-admin user somehow navigates to this page,
  // show an access denied toast and redirect them
  useEffect(() => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to view this page.",
        variant: "destructive",
      });
    }
  }, [isAdmin, toast]);
  
  // If not admin, redirect to home page
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  const handleAddUser = () => {
    toast({
      title: "Feature not implemented",
      description: "Adding new users is not available in the demo.",
      variant: "default",
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'manager':
        return 'default';
      case 'user':
      default:
        return 'secondary';
    }
  };

  return (
    <SidebarLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Button onClick={handleAddUser} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <CardTitle className="text-lg">{user.name}</CardTitle>
                <CardDescription className="text-sm">{user.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                <Button variant="outline" size="sm" onClick={() => {
                  toast({
                    title: "Feature not implemented",
                    description: "User editing is not available in the demo.",
                  });
                }}>
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </SidebarLayout>
  );
};

export default UsersPage;
