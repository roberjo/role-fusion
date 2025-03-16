# API Reference

## Components

### RoleProvider
The root component that provides role context to your application.

```typescript
import { RoleProvider } from 'role-fusion';

<RoleProvider
  roles={roles}
  initialRole="user"
  onPermissionDenied={() => {}}
>
  {children}
</RoleProvider>
```

## Hooks

### useRole
```typescript
const {
  hasPermission,
  currentRole,
  setRole,
  permissions
} = useRole();
```

### usePermission
```typescript
const allowed = usePermission('users.edit');
```

## Types

### RoleDefinition
```typescript
interface RoleDefinition {
  permissions: string[];
  inherits?: string[];
}
```

### RoleConfig
```typescript
interface RoleConfig {
  [key: string]: RoleDefinition;
}
```