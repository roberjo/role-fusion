import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserCog } from 'lucide-react';

export function ImpersonationBanner() {
  const { authState, stopImpersonation } = useAuth();

  if (!authState.impersonation.isImpersonating) {
    return null;
  }

  return (
    <Alert variant="default" className="bg-yellow-50 border-yellow-200 text-yellow-800">
      <UserCog className="h-4 w-4" />
      <AlertDescription className="flex justify-between items-center">
        <span>
          You are impersonating <strong>{authState.impersonation.impersonatedUser?.name}</strong>
        </span>
        <button 
          onClick={stopImpersonation}
          className="text-xs underline hover:text-yellow-900"
        >
          Stop Impersonating
        </button>
      </AlertDescription>
    </Alert>
  );
} 