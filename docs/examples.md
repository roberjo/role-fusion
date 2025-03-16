# Role Fusion Examples

## Basic Role-Based Access Control

### Simple Permission Check
```typescript
import { useRole } from 'role-fusion';

function AdminButton() {
  const { hasPermission } = useRole();
  
  if (!hasPermission('admin.access')) {
    return null;
  }
  
  return <button>Admin Actions</button>;
}
```

### Role-Based Route Protection
```typescript
import { useRole } from 'role-fusion';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, requiredPermission }) {
  const { hasPermission } = useRole();
  
  if (!hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
}
```

### Dynamic Navigation Menu
```typescript
import { useRole } from 'role-fusion';

const menuItems = [
  { label: 'Dashboard', path: '/', permission: 'dashboard.view' },
  { label: 'Users', path: '/users', permission: 'users.view' },
  { label: 'Settings', path: '/settings', permission: 'settings.access' }
];

function Navigation() {
  const { hasPermission } = useRole();
  
  return (
    <nav>
      {menuItems
        .filter(item => hasPermission(item.permission))
        .map(item => (
          <Link key={item.path} to={item.path}>
            {item.label}
          </Link>
        ))}
    </nav>
  );
}
```

### Role Switching