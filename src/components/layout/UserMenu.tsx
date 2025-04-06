//import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronDown, UserCog } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
//import { toast } from "sonner";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { User as UserType } from "@/lib/auth";
import { ThemeSwitcher } from "../theme/ThemeSwitcher";
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { getAvailableUsers } from '@/lib/auth';

interface UserMenuProps {
  user: UserType | null;
  onLogout: () => void;
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const navigate = useNavigate();
  const { authState, hasRole, startImpersonation, stopImpersonation } = useAuth();
  const availableUsers = getAvailableUsers();
  
  // Use the effective user (either impersonated or real)
  const effectiveUser = authState.impersonation.isImpersonating 
    ? authState.impersonation.impersonatedUser 
    : user;

  if (!effectiveUser) {
    return (
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <div className="text-right mr-2">
          <p className="text-sm font-medium leading-none">Loading...</p>
        </div>
        <Avatar className="h-9 w-9">
          <AvatarFallback>...</AvatarFallback>
        </Avatar>
      </div>
    );
  }

  const isAdmin = hasRole('ADMIN');

  return (
    <div className="flex items-center gap-2">
      <ThemeSwitcher />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="text-right mr-2">
              <p className="text-sm font-medium leading-none">{effectiveUser.name}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {effectiveUser.role}
                {authState.impersonation.isImpersonating && " (Impersonating)"}
              </p>
            </div>
            <Avatar className="h-9 w-9">
              <AvatarImage src={effectiveUser.avatar || "/placeholder.svg"} alt={effectiveUser.name} />
              <AvatarFallback>{effectiveUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
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
          
          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Impersonation</DropdownMenuLabel>
              {authState.impersonation.isImpersonating ? (
                <DropdownMenuItem onClick={() => stopImpersonation()}>
                  <UserCog className="mr-2 h-4 w-4" />
                  <span>Stop Impersonating</span>
                </DropdownMenuItem>
              ) : (
                availableUsers
                  .filter(u => u.id !== user?.id)
                  .map(userToImpersonate => (
                    <DropdownMenuItem
                      key={userToImpersonate.id}
                      onClick={() => startImpersonation(userToImpersonate)}
                    >
                      <UserCog className="mr-2 h-4 w-4" />
                      <span>Impersonate {userToImpersonate.name}</span>
                    </DropdownMenuItem>
                  ))
              )}
            </>
          )}
          
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
    </div>
  );
}
