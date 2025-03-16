# Troubleshooting

## Common Issues and Solutions

### Permission Not Working

**Issue**: Component isn't showing even though the user should have permission.

**Solutions**:
1. Check if the RoleProvider is properly wrapped around your app:
```typescript
// Correct
const App = () => (
  <RoleProvider>
    <YourApp />
  </RoleProvider>
);

// Incorrect - Missing Provider
const App = () => <YourApp />;
```

2. Verify permission string matches exactly:
```typescript
// These are different permissions
hasPermission('users.edit')
hasPermission('user.edit')  // Won't match
```

### Role Inheritance Issues

**Issue**: Inherited permissions not being recognized.

**Solution**: Check your role configuration:
```typescript
// Correct
const roles = {
  admin: {
    permissions: ['admin.*'],
    inherits: ['editor']  // Correctly specified
  },
  editor: {
    permissions: ['content.*']
  }
};

// Incorrect
const roles = {
  admin: {
    permissions: ['admin.*'],
    inherits: 'editor'    // Should be an array
  }
};
```

### Performance Issues

**Issue**: Excessive re-renders when using role hooks.

**Solution**: Memoize permission checks:
```typescript
import { useMemo } from 'react';
import { useRole } from 'role-fusion';

function OptimizedComponent() {
  const { hasPermission } = useRole();
  
  const canEditUsers = useMemo(() => 
    hasPermission('users.edit'),
    [hasPermission]
  );
  
  return canEditUsers ? <EditForm /> : null;
}
```

## Debug Checklist

1. ✅ Verify RoleProvider is at the root level
2. ✅ Check permission strings for typos
3. ✅ Confirm role configuration is correct
4. ✅ Validate inheritance chain
5. ✅ Check console for any warnings
6. ✅ Ensure latest version is installed

## Still Having Issues?

- Check our [GitHub Issues](https://github.com/yourusername/role-fusion/issues)
- Join our [Discord Community](https://discord.gg/role-fusion)
- Read the [API Reference](./api-reference.md)