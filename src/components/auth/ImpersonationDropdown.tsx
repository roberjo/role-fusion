import { useAuth } from '@/contexts/AuthContext';
import { getAvailableUsers } from '@/lib/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { UserIcon, UserCogIcon } from 'lucide-react';

export function ImpersonationDropdown() {
  const { user, hasRole, startImpersonation, stopImpersonation, authState } = useAuth();
  const availableUsers = getAvailableUsers();

  // Check if the effective user (not impersonated) is an admin
  if (!user || !hasRole('ADMIN')) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <UserCogIcon className="h-4 w-4 mr-2" />
          Impersonate
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {authState.impersonation.isImpersonating ? (
          <DropdownMenuItem onClick={() => stopImpersonation()}>
            <UserIcon className="h-4 w-4 mr-2" />
            Stop Impersonating
          </DropdownMenuItem>
        ) : (
          availableUsers
            .filter(u => u.id !== user.id)
            .map(userToImpersonate => (
              <DropdownMenuItem
                key={userToImpersonate.id}
                onClick={() => startImpersonation(userToImpersonate)}
              >
                <UserIcon className="h-4 w-4 mr-2" />
                {userToImpersonate.name} ({userToImpersonate.role})
              </DropdownMenuItem>
            ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 