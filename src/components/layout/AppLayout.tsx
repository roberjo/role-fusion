import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { AppSidebar } from './AppSidebar';
import { ImpersonationBanner } from '../auth/ImpersonationBanner';
import { logout } from '@/lib/auth';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <ImpersonationBanner />
      <Navbar />
      <div className="flex">
        <AppSidebar currentPath={location.pathname} onLogout={logout} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 