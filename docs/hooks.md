# Hooks

## useRole
The primary hook for role-based access control.

### Usage
```typescript
function AdminPanel() {
  const { hasPermission, currentRole } = useRole();

  if (!hasPermission('admin.access')) {
    return <AccessDenied />;
  }

  return <div>Admin Panel Content</div>;
}
```

## usePermission
A simplified hook for checking single permissions.

### Usage
```typescript
function EditButton() {
  const canEdit = usePermission('posts.edit');

  return canEdit ? <button>Edit</button> : null;
}
```

## useRoleUpdate
Hook for managing role changes.

### Usage
```typescript
function RoleSwitcher() {
  const { setRole, currentRole } = useRoleUpdate();

  return (
    <select 
      value={currentRole}
      onChange={(e) => setRole(e.target.value)}
    >
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>
  );
}
```