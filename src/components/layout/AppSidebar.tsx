// import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Grid, Workflow, Users, Settings, FileText, LogOut } from 'lucide-react';
import { cn } from "@/lib/utils";
import { hasRole } from "@/lib/auth";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  currentPath: string;
  onLogout: () => void;
}

export function AppSidebar({ currentPath, onLogout }: AppSidebarProps) {
  const isAdmin = hasRole('ADMIN');
  
  // Base menu items that all users can see
  const menuItems = [
    { title: "Dashboard", path: "/", icon: Home },
    { title: "Data Grid", path: "/data-grid", icon: Grid },
    { title: "Workflows", path: "/workflows", icon: Workflow },
    // Users menu item is conditionally added below for admins only
    { title: "Reports", path: "/reports", icon: FileText },
    { title: "Settings", path: "/settings", icon: Settings },
  ];
  
  // Add Users menu item for admin users only
  if (isAdmin) {
    menuItems.splice(3, 0, { title: "Users", path: "/users", icon: Users });
  }

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 px-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-lg">E</div>
          <span className="font-semibold">Enterprise OS</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={cn(
                    currentPath === item.path ? "bg-sidebar-accent" : ""
                  )}>
                    <Link to={item.path} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <button 
          onClick={onLogout} 
          className="w-full p-2 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors rounded-md"
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
