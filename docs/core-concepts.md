# Core Concepts

## Roles
A role is a collection of permissions that can be assigned to users. Roles help organize permissions and make them easier to manage.

## Permissions
Permissions are individual access rights that determine what actions a user can perform. They follow a dot notation format:
- `resource.action` (e.g., `users.create`)
- `module.resource.action` (e.g., `admin.users.create`)

## Role Hierarchy
Roles can inherit permissions from other roles:

```typescript
const roles = {
  admin: {
    permissions: ['*'], // Wildcard for all permissions
    inherits: ['editor']
  },
  editor: {
    permissions: ['posts.create', 'posts.edit'],
    inherits: ['user']
  },
  user: {
    permissions: ['posts.read']
  }
};
```