import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
//import { useToast } from "@/hooks/use-toast";
import { logout, getEffectiveUser } from "@/lib/auth";
import { AppSidebar } from "./AppSidebar";
import { PageTitle } from "./PageTitle";
import { UserMenu } from "./UserMenu";
//import { useAuth } from "@/contexts/AuthContext";
import { ImpersonationBanner } from "@/components/auth/ImpersonationBanner";

interface SidebarLayoutProps {
  children: ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const location = useLocation();
  //const { toast } = useToast();
  const navigate = useNavigate();
  const [pageTransition, setPageTransition] = useState(false);
  //const { authState } = useAuth();
  const effectiveUser = getEffectiveUser();

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
            <div className="flex items-center gap-2">
              <UserMenu user={effectiveUser} onLogout={handleLogout} />
            </div>
          </header>
          
          <ImpersonationBanner />
          
          <main className={cn(
            "flex-1 p-6 transition-opacity duration-300",
            pageTransition ? "opacity-0" : "opacity-100"
          )}>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
