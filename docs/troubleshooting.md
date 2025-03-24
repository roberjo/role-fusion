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

3. Check multiple permissions:
```typescript
// Use checkPermissions for multiple checks
const { checkPermissions } = useRole();
const canManageUsers = checkPermissions(['users.create', 'users.edit']);
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

**Solution**: Memoize permission checks and use proper dependencies:
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

### Notification Settings Not Persisting

**Issue**: User notification preferences reset after page reload.

**Solutions**:
1. Verify the preferences are being saved to backend:
```typescript
const { updatePreferences } = useNotificationPreferences();

// Correct
await updatePreferences(newSettings);

// Incorrect - Missing await
updatePreferences(newSettings);
```

2. Check local storage persistence:
```typescript
// Add persistence to localStorage
const { preferences } = useNotificationPreferences({
  persistKey: 'user-notifications'
});
```

### UI Glitches

**Issue**: Glass effect components not rendering correctly.

**Solutions**:
1. Ensure proper CSS class usage:
```typescript
// Correct
<div className="glass-panel">
  <Card>...</Card>
</div>

// Incorrect
<div className="glass">
  <Card>...</Card>
</div>
```

2. Check backdrop-filter support:
```css
/* Add fallback for browsers that don't support backdrop-filter */
.glass-effect {
  @apply bg-background/80 border border-border/50;
  backdrop-filter: blur(8px);
}

@supports not (backdrop-filter: blur(8px)) {
  .glass-effect {
    @apply bg-background/95;
  }
}
```

## Debug Checklist

1. ✅ Verify RoleProvider is at the root level
2. ✅ Check permission strings for typos
3. ✅ Confirm role configuration is correct
4. ✅ Validate inheritance chain
5. ✅ Check console for any warnings
6. ✅ Ensure latest version is installed
7. ✅ Verify API endpoints are accessible
8. ✅ Check network requests in DevTools
9. ✅ Validate notification settings persistence
10. ✅ Test UI components in different browsers

## Performance Optimization Tips

1. Use `checkPermissions` for bulk permission checks instead of multiple `hasPermission` calls
2. Implement proper memoization for expensive computations
3. Lazy load components that require role checks
4. Use the glass effect sparingly on performance-critical pages
5. Implement proper error boundaries around role-dependent components

## Still Having Issues?

- Check our [GitHub Issues](https://github.com/yourusername/role-fusion/issues)
- Join our [Discord Community](https://discord.gg/role-fusion)
- Read the [API Reference](./api-reference.md)
- Review the [Component Guide](./components.md)