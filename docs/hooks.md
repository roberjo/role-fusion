# Hooks

## useRole
The primary hook for role-based access control.

### Usage
```typescript
function AdminPanel() {
  const { hasPermission, currentRole, checkPermissions } = useRole();

  // Single permission check
  if (!hasPermission('admin.access')) {
    return <AccessDenied />;
  }

  // Multiple permission check
  const canManageUsers = checkPermissions(['users.create', 'users.edit', 'users.delete']);

  return (
    <div>
      <h1>Admin Panel</h1>
      {canManageUsers && <UserManagement />}
    </div>
  );
}
```

## usePermission
A simplified hook for checking single permissions.

### Usage
```typescript
function EditButton() {
  const canEdit = usePermission('posts.edit');
  const { toast } = useToast();

  const handleClick = () => {
    if (!canEdit) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to edit posts.",
        variant: "destructive"
      });
      return;
    }
    // Edit logic here
  };

  return <button onClick={handleClick}>Edit</button>;
}
```

## useRoleUpdate
Hook for managing role changes and transitions.

### Usage
```typescript
function RoleSwitcher() {
  const { setRole, currentRole, isPending } = useRoleUpdate();

  const handleRoleChange = async (newRole: string) => {
    try {
      await setRole(newRole);
      toast({
        title: "Role Updated",
        description: `Successfully switched to ${newRole} role.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role.",
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      <select 
        value={currentRole}
        onChange={(e) => handleRoleChange(e.target.value)}
        disabled={isPending}
      >
        <option value="user">User</option>
        <option value="editor">Editor</option>
        <option value="admin">Admin</option>
      </select>
      {isPending && <Spinner />}
    </div>
  );
}
```

## useNotificationPreferences
Hook for managing user notification settings.

### Usage
```typescript
function NotificationSettings() {
  const { preferences, updatePreferences, isLoading } = useNotificationPreferences();

  const handleToggle = async (key: string) => {
    try {
      await updatePreferences({
        ...preferences,
        [key]: !preferences[key]
      });
      toast({
        title: "Settings Updated",
        description: "Notification preferences saved successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification settings."
      });
    }
  };

  return (
    <div className="space-y-4">
      <Switch
        checked={preferences.emailNotifications}
        onCheckedChange={() => handleToggle('emailNotifications')}
        disabled={isLoading}
      />
      <Switch
        checked={preferences.securityAlerts}
        onCheckedChange={() => handleToggle('securityAlerts')}
        disabled={isLoading}
      />
    </div>
  );
}
```