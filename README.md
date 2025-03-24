# Role Fusion 🔐

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-47%20passed-brightgreen?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)

A modern, powerful role-based access control (RBAC) management system built with React, TypeScript, and Tailwind CSS.

[Getting Started](#-getting-started) •
[Features](#-features) •
[Documentation](#-documentation) •
[Contributing](#-contributing)

</div>

## 🚀 Features

- 🔐 **Dynamic Role Management** - Flexible role creation and assignment
- 🎯 **Granular Permissions** - Fine-grained access control
- 🔄 **React Integration** - Seamless hooks for role-based rendering
- 🎨 **Modern UI Components** - Built with Radix UI and Tailwind CSS
- 📱 **Responsive Design** - Works on all devices
- ✅ **Type Safety** - Full TypeScript support
- 🧪 **Test Coverage** - Comprehensive testing with Vitest

## 📊 Test Coverage

Latest test results show:
- ✅ 47 tests passing across 11 test files
- 🎯 Key components with 100% coverage:
  - `RoleProvider`
  - `AdminPanel`
  - `TestComponent`
  - Core UI components (Button, Toast, Tooltip)
- 🔍 Role management features thoroughly tested:
  - Role switching functionality
  - Permission checking
  - Component rendering based on roles
  - Context provider integration

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Clone the Repository

```bash
git clone https://github.com/yourusername/role-fusion.git
cd role-fusion
```

### Install Dependencies

```bash
npm install
# or
yarn install
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### Testing

Run the test suite:

```bash
# Run tests
npm run test
# or
yarn test

# Run tests with UI
npm run test:ui
# or
yarn test:ui

# Run tests with coverage
npm run coverage
# or
yarn coverage
```

#### Current Test Coverage

| Category | Coverage | Details |
|----------|----------|---------|
| Statements | 6.5% (615/9435) | Core functionality coverage |
| Conditionals | 29.4% (37/126) | Branch logic coverage |
| Methods | 17.0% (18/106) | Function coverage |
| Files | 102 files | Across 0 packages |

##### Coverage by Package

- ✅ `__tests__`: 100% (8/8 statements)
- ✅ `components`: 100% (8/8 statements)
- ✅ `contexts`: 100% (2/2 statements)
- 🟨 `hooks`: 31.6% (6/19 statements)
- ❌ `components/auth`: 0% (0/3 statements)
- ❌ `components/layout`: 0% (0/7 statements)
- ❌ `components/theme`: 0% (0/26 statements)
- ❌ `components/ui`: 0% (0/14 statements)
- ❌ `lib`: 0% (0/187 statements)

##### Coverage Gaps

Key areas needing test coverage:
- Authentication flows in `lib/auth.ts`
- API interactions in `lib/api.ts`
- Theme management in `components/theme`
- UI component functionality
- Mobile responsiveness hooks

### Build

Create a production build:

```bash
npm run build
# or
yarn build
```

## 🧰 Available Scripts

- `dev` - Start development server
- `build` - Create production build
- `preview` - Preview production build
- `test` - Run test suite
- `test:ui` - Run tests with UI
- `test:watch` - Run tests in watch mode
- `coverage` - Generate test coverage report
- `lint` - Lint and fix code
- `lint:check` - Check code for linting issues

## 🏗️ Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **State Management:** React Query
- **Form Handling:** React Hook Form
- **Testing:** Vitest
- **Type Checking:** TypeScript
- **Code Quality:** ESLint

## 📚 Documentation

For detailed documentation, please visit:

- [API Reference](./docs/README.md)
- [Component Guide](./docs/components.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details on how to:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ by the Role Fusion team

</div>
