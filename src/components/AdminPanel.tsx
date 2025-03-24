import { useRole } from '@/hooks/useRole';

export const AdminPanel = () => {
  const { hasPermission } = useRole();
  if (!hasPermission('admin.access')) return null;
  return <div data-testid="admin-panel">Admin Only Content</div>;
}; 