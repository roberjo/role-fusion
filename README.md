# Role Fusion 🔐

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-47%20passed-brightgreen?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)

A modern, powerful role-based access control (RBAC) management system built with React, TypeScript, and Tailwind CSS.

[Features](#-features) •
[Quick Start](#-quick-start) •
[Documentation](#-documentation) •
[Contributing](#-contributing)

</div>

## 🚀 Features

- 🔐 **Dynamic Role Management** - Flexible role creation and assignment
- 🎯 **Granular Permissions** - Fine-grained access control with bulk permission checks
- 🔄 **React Integration** - Seamless hooks for role-based rendering
- 🎨 **Modern UI Components** - Built with Radix UI, Tailwind CSS, and glass effects
- 📱 **Responsive Design** - Works on all devices with smooth animations
- ✅ **Type Safety** - Full TypeScript support
- 🧪 **Test Coverage** - Comprehensive testing with Vitest
- 🔔 **Notification System** - Customizable user notification preferences
- 🔄 **Workflow Management** - Built-in workflow approval system
- 🎭 **Role Transitions** - Smooth role switching with loading states
- 🎨 **Theme Support** - Light/dark mode with customizable colors
- 🔒 **Security Focus** - Regular security audits and dependency updates

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/role-fusion.git
cd role-fusion

# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Tech Stack

- **Core:** React 18, TypeScript, Vite
- **UI:** Tailwind CSS, Radix UI
- **State:** React Query
- **Forms:** React Hook Form
- **Testing:** Vitest
- **Quality:** ESLint, Prettier
- **CI/CD:** GitHub Actions
- **Performance:** Lighthouse CI
- **Security:** Automated scans, Dependabot

## 📊 Quality & Testing

### Test Coverage
Latest results from 47 tests across 11 files:

| Category | Coverage | Details |
|----------|----------|---------|
| Statements | 6.5% (615/9435) | Core functionality coverage |
| Conditionals | 29.4% (37/126) | Branch logic coverage |
| Methods | 17.0% (18/106) | Function coverage |
| Files | 102 files | Across 0 packages |

#### Package Coverage Status
- ✅ `__tests__`, `components`, `contexts`: 100%
- 🟨 `hooks`: 31.6%
- ❌ `components/auth`, `layout`, `theme`, `ui`, `lib`: Needs coverage

#### Areas for Improvement
- Authentication flows (`lib/auth.ts`)
- API interactions (`lib/api.ts`)
- Theme management (`components/theme`)
- UI component functionality
- Mobile responsiveness hooks

### Code Quality Standards

#### Static Analysis
- ✅ **TypeScript**: Strict type checking
- 🔍 **ESLint**: TypeScript, React Hooks, and best practices
- 📝 **Prettier**: Consistent code formatting
- 🎨 **Component Structure**: Standardized organization

#### Continuous Quality Checks
Every PR triggers:
- Type checking
- Linting & formatting
- Test coverage analysis
- Bundle size monitoring
- Performance benchmarking
- Security audits

## 🛠️ Development

### Available Scripts
- `dev` - Start development server
- `build` - Create production build
- `preview` - Preview production build
- `test` - Run test suite
- `test:ui` - Run tests with UI
- `test:watch` - Run tests in watch mode
- `coverage` - Generate test coverage report
- `lint` - Lint and fix code
- `lint:check` - Check code for linting issues

### Build
```bash
npm run build
# or
yarn build
```

## 📚 Documentation

Comprehensive guides available:
- [API Reference](./docs/README.md)
- [Component Guide](./docs/components.md)
- [Hooks Documentation](./docs/hooks.md)
- [Troubleshooting Guide](./docs/troubleshooting.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

## 🤝 Contributing

We welcome contributions! See our [Contributing Guidelines](./CONTRIBUTING.md) for:
1. Fork and clone process
2. Development setup
3. Pull request guidelines
4. Code style requirements

Our CI pipeline automatically:
- Runs all tests
- Checks code quality
- Analyzes bundle size
- Runs security scans
- Generates preview deployments

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ by the Role Fusion team

</div>
