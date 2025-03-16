# Role Fusion

A powerful role-based access control (RBAC) management system for modern applications.

## 🚀 Features

- Dynamic role management
- Granular permission control
- Easy integration with existing authentication systems
- TypeScript support
- React hooks for role-based rendering

## 📦 Installation

```bash
npm install role-fusion
# or
yarn add role-fusion
```

## 🔧 Quick Start

```typescript
import { RoleProvider, useRole } from 'role-fusion';

// Initialize provider
const App = () => (
  <RoleProvider>
    <YourApp />
  </RoleProvider>
);

// Use in components
const MyProtectedComponent = () => {
  const { hasPermission } = useRole();
  
  if (hasPermission('users.edit')) {
    return <div>Protected Content</div>;
  }
  return null;
};
```

## 📚 Documentation

Visit our [documentation](./docs/README.md) for detailed guides and API reference.

## 🤝 Contributing

We welcome contributions! Please see our [contributing guidelines](./CONTRIBUTING.md) for details.

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details
