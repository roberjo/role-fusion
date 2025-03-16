# Getting Started with Role Fusion

## Installation

Install Role Fusion using your preferred package manager:

```bash
npm install role-fusion
# or
yarn add role-fusion
```

## Basic Setup

1. **Initialize the Provider**
```typescript
import { RoleProvider } from 'role-fusion';

function App() {
  return (
    <RoleProvider>
      <YourApp />
    </RoleProvider>
  );
}
```

2. **Define Your Roles**
```typescript
const roles = {
  admin: {
    permissions: ['users.create', 'users.edit', 'users.delete']
  },
  editor: {
    permissions: ['users.edit']
  }
};
```

3. **Use the Hooks**
```typescript
import { useRole } from 'role-fusion';

function ProtectedComponent() {
  const { hasPermission } = useRole();

  if (!hasPermission('users.edit')) {
    return null;
  }

  return <div>Protected Content</div>;
}
```