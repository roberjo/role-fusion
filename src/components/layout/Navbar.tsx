import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ImpersonationDropdown } from '../auth/ImpersonationDropdown';
import { UserNav } from '../auth/UserNav';

export function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="/logo.svg"
                alt="Logo"
              />
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <ImpersonationDropdown />
            <UserNav user={user} />
          </div>
        </div>
      </div>
    </nav>
  );
} 