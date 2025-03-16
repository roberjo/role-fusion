import { ReactNode, useEffect, useState } from "react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarProvider, 
  SidebarTrigger, 
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";
import { LogOut, Home, Grid, Workflow, Users, Settings, FileText, User, ChevronDown } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser, logout, User as UserType } from "@/lib/auth";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface SidebarLayoutProps {
  children: ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const location = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [pageTransition, setPageTransition] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  useEffect(() => {
    setPageTransition(true);
    const timer = setTimeout(() => {
      setPageTransition(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar currentPath={location.pathname} onLogout={handleLogout} />
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="h-16 border-b border-border/50 flex items-center px-6 glass-effect sticky top-0 z-20">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1">
              <PageTitle pathname={location.pathname} />
            </div>
            <UserMenu user={currentUser} onLogout={handleLogout} />
          </header>
          <main className={cn(
            "flex-1 p-6",
            pageTransition ? "animate-fade-in" : ""
          )}>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function PageTitle({ pathname }: { pathname: string }) {
  const title = pathname === "/" 
    ? "Dashboard" 
    : pathname.split("/").pop()?.split("-").map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(" ") || "Dashboard";

  return (
    <div className="flex flex-col">
      <span className="text-xs font-medium text-muted-foreground">
        Enterprise Management System
      </span>
      <h1 className="text-xl font-semibold">{title}</h1>
    </div>
  );
}

interface UserMenuProps {
  user: UserType | null;
  onLogout: () => void;
}

function UserMenu({ user, onLogout }: UserMenuProps) {
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-right mr-2">
          <p className="text-sm font-medium leading-none">Loading...</p>
        </div>
        <Avatar className="h-9 w-9">
          <AvatarFallback>...</AvatarFallback>
        </Avatar>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="text-right mr-2">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
          </div>
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/settings")}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {
          toast.info("Switched to demo mode");
          navigate("/login");
        }}>
          Switch User
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface AppSidebarProps {
  currentPath: string;
  onLogout: () => void;
}

function AppSidebar({ currentPath, onLogout }: AppSidebarProps) {
  const menuItems = [
    { title: "Dashboard", path: "/", icon: Home },
    { title: "Data Grid", path: "/data-grid", icon: Grid },
    { title: "Workflows", path: "/workflows", icon: Workflow },
    { title: "Users", path: "/users", icon: Users },
    { title: "Reports", path: "/reports", icon: FileText },
    { title: "Settings", path: "/settings", icon: Settings },
  ];

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
