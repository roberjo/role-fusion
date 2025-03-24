import { useRole } from '@/hooks/useRole';
import { AdminPanel } from './AdminPanel';

export const TestComponent = () => {
  const { setRole } = useRole();
  return (
    <div>
      <select 
        data-testid="role-switcher"
        onChange={(e) => setRole(e.target.value)}
        defaultValue="user"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <AdminPanel />
    </div>
  );
}; 