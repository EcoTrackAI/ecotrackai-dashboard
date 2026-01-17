# Contributing to EcoTrack AI Dashboard

Thank you for your interest in contributing to EcoTrack AI Dashboard! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

---

## 🤝 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of experience level, gender, identity, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality.

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

---

## 🚀 Getting Started

### Prerequisites

1. **Node.js 20+** and npm installed
2. **PostgreSQL 14+** running locally or remote connection
3. **Firebase** project with Realtime Database enabled
4. **Git** for version control
5. **Code Editor** (VS Code recommended)

### Initial Setup

1. **Fork the repository** on GitHub

2. **Clone your fork**:

   ```bash
   git clone https://github.com/YOUR_USERNAME/ecotrackai-dashboard.git
   cd ecotrackai-dashboard
   ```

3. **Add upstream remote**:

   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/ecotrackai-dashboard.git
   ```

4. **Install dependencies**:

   ```bash
   npm install
   ```

5. **Set up environment variables** (copy `.env.example` to `.env.local` and fill in values):

   ```bash
   cp .env.example .env.local
   ```

6. **Run database migrations**:

   ```bash
   psql -U your_user -d ecotrackai -f database/schema.sql
   ```

7. **Start development server**:
   ```bash
   npm run dev
   ```

---

## 🔄 Development Workflow

### Branch Strategy

We use a simplified Git workflow:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

### Creating a Feature Branch

1. **Update your local repository**:

   ```bash
   git checkout main
   git pull upstream main
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Making Changes

1. **Make your changes** in small, logical commits
2. **Test your changes** thoroughly
3. **Run linting**:
   ```bash
   npm run lint
   ```
4. **Build the project** to check for errors:
   ```bash
   npm run build
   ```

### Syncing with Upstream

Regularly sync your fork with the upstream repository:

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

---

## 📝 Coding Standards

### TypeScript Guidelines

- **Always use TypeScript** - No `.js` or `.jsx` files
- **Strict type safety** - No `any` types unless absolutely necessary
- **Centralized types** - All types and interfaces in `types/globals.d.ts`
- **Explicit return types** - Always specify function return types

Example:

```typescript
// ✅ Good
function calculatePower(voltage: number, current: number): number {
  return voltage * current;
}

// ❌ Bad
function calculatePower(voltage, current) {
  return voltage * current;
}
```

### React Component Guidelines

- **Functional components only** - No class components
- **Use hooks properly** - Follow [Rules of Hooks](https://react.dev/warnings/invalid-hook-call-warning)
- **Props destructuring** - Destructure props in function parameters
- **Named exports** - Use named exports for components

Example:

```typescript
// ✅ Good
export function MetricCard({ title, value, unit }: MetricCardProps) {
  return (
    <div className="metric-card">
      <h3>{title}</h3>
      <p>{value} {unit}</p>
    </div>
  );
}

// ❌ Bad
export default function MetricCard(props) {
  return (
    <div className="metric-card">
      <h3>{props.title}</h3>
      <p>{props.value} {props.unit}</p>
    </div>
  );
}
```

### Code Organization

- **One component per file**
- **Group related files** in feature folders
- **Index exports** - Use `index.ts` for clean imports
- **Separate concerns** - Keep business logic separate from UI

### Naming Conventions

- **Components**: PascalCase (`MetricCard.tsx`)
- **Utilities**: camelCase (`calculateEnergy.ts`)
- **Types**: PascalCase with descriptive suffixes (`SensorStatusProps`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_ATTEMPTS`)
- **Files**: kebab-case or PascalCase for components

### ESLint Rules

Follow the project's ESLint configuration:

```bash
npm run lint
```

Fix auto-fixable issues:

```bash
npm run lint -- --fix
```

### Styling Guidelines

- **Tailwind CSS only** - No custom CSS unless necessary
- **Responsive design** - Mobile-first approach
- **Consistent spacing** - Use Tailwind spacing scale
- **Dark mode support** - Use Tailwind dark mode classes

Example:

```typescript
// ✅ Good
<div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
  <h2 className="text-xl font-bold mb-2">Title</h2>
  <p className="text-gray-600 dark:text-gray-300">Content</p>
</div>

// ❌ Bad
<div style={{ padding: '16px', backgroundColor: 'white' }}>
  <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Title</h2>
  <p>Content</p>
</div>
```

---

## 📋 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, missing semicolons, etc.)
- `refactor` - Code refactoring without changing functionality
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `chore` - Maintenance tasks, dependency updates

### Examples

```bash
# Feature
feat(analytics): add power consumption trend chart

# Bug fix
fix(api): resolve race condition in relay control endpoint

# Documentation
docs(readme): update installation instructions

# Refactoring
refactor(components): simplify MetricCard props interface

# Performance
perf(database): optimize historical data query with indexes
```

### Best Practices

- **Atomic commits** - One logical change per commit
- **Present tense** - "add feature" not "added feature"
- **Imperative mood** - "fix bug" not "fixes bug"
- **Lowercase** - Start with lowercase letter
- **No period** - Don't end subject with a period
- **Max 72 characters** - Keep subject line concise

---

## 🔀 Pull Request Process

### Before Submitting

1. **Update your branch** with the latest upstream changes
2. **Run all checks**:
   ```bash
   npm run lint
   npm run build
   ```
3. **Test thoroughly** on different screen sizes
4. **Update documentation** if needed
5. **Add yourself** to CONTRIBUTORS.md (if first contribution)

### Creating a Pull Request

1. **Push your branch** to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a Pull Request** on GitHub with:
   - Clear, descriptive title
   - Detailed description of changes
   - Reference related issues (`Fixes #123`)
   - Screenshots for UI changes
   - Breaking changes highlighted

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Tested locally
- [ ] Build passes
- [ ] Linting passes

## Screenshots (if applicable)

[Add screenshots here]

## Related Issues

Fixes #(issue number)

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
```

### Review Process

1. **Automated checks** must pass (linting, build)
2. **At least one approval** from maintainers required
3. **Address feedback** promptly and professionally
4. **Squash commits** if requested
5. **Maintainers will merge** approved PRs

---

## 🧪 Testing

### Manual Testing

1. **Start the development server**:

   ```bash
   npm run dev
   ```

2. **Test all affected features**:
   - Create test scenarios
   - Test edge cases
   - Verify error handling
   - Check responsive design

3. **Test in different browsers**:
   - Chrome
   - Firefox
   - Safari
   - Edge

### Build Testing

Always verify the production build:

```bash
npm run build
npm start
```

### Database Testing

If your changes affect database operations:

1. Test with fresh database
2. Test with existing data
3. Verify migrations work correctly
4. Check for SQL injection vulnerabilities

---

## 📚 Documentation

### When to Update Documentation

Update documentation when you:

- Add new features
- Change existing functionality
- Add new API endpoints
- Modify environment variables
- Update dependencies

### Documentation Files

- **README.md** - Project overview, quick start
- **docs/API.md** - API endpoint documentation
- **docs/ARCHITECTURE.md** - System design and architecture
- **docs/COMPONENTS.md** - Component documentation
- **docs/DEPLOYMENT.md** - Deployment guides
- **docs/DEVELOPMENT.md** - Development setup
- **CONTRIBUTING.md** - This file

### Code Documentation

- **JSDoc comments** for complex functions
- **Type definitions** for all interfaces
- **Inline comments** for non-obvious logic

Example:

```typescript
/**
 * Calculates total energy consumption for a date range
 *
 * @param startDate - Start of the date range (ISO 8601)
 * @param endDate - End of the date range (ISO 8601)
 * @param roomIds - Array of room IDs to include in calculation
 * @returns Total energy in kWh
 */
function calculateTotalEnergy(
  startDate: string,
  endDate: string,
  roomIds: string[],
): number {
  // Implementation
}
```

---

## 🎯 Areas for Contribution

### High Priority

- Performance optimizations
- Bug fixes
- Documentation improvements
- Accessibility enhancements
- Mobile responsiveness

### Feature Requests

Check [GitHub Issues](https://github.com/ORIGINAL_OWNER/ecotrackai-dashboard/issues) for:

- Feature requests labeled `enhancement`
- Bugs labeled `bug`
- Good first issues labeled `good first issue`

### Ideas Welcome

- New chart types
- Additional analytics
- Improved UI/UX
- Better error handling
- Internationalization (i18n)

---

## ❓ Questions?

- Open a [GitHub Discussion](https://github.com/ORIGINAL_OWNER/ecotrackai-dashboard/discussions)
- Check existing [Issues](https://github.com/ORIGINAL_OWNER/ecotrackai-dashboard/issues)
- Read the [Documentation](docs/)

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

**Thank you for contributing to EcoTrack AI Dashboard! 🌿⚡**
