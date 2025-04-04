# Portello Project Guide

## Commands
- Build: `npm run build`
- Dev: `npm run dev`
- Lint: `npm run lint` (runs eslint and stylelint)
- Test: `npm run test` (runs prettier check, lint, typecheck, and jest)
- Single test: `npm run jest -- -t "test name"` or `npm run jest -- path/to/test/file.test.ts`
- Type check: `npm run typecheck`
- Format code: `npm run prettier:write`

## Code Style Guidelines
- **Imports**: Use `@/` path alias for src directory imports
- **Types**: Use TypeScript strictly - explicit return types on exported functions
- **Components**: Use functional React components with proper props typing
- **Naming**: PascalCase for components/types, camelCase for variables/functions
- **CSS**: Use CSS modules with component-specific names (*.module.css)
- **State Management**: Use React Context (CartContext) and React Query
- **Error Handling**: Use error boundaries and proper async/await error handling
- **Testing**: Write Jest tests for components and utilities
- **Formatting**: Follow Prettier and ESLint config-mantine rules
- **Auth**: Use Kinde Auth with proper authorization checks