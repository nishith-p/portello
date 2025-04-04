# Portello Project Restructuring Plan

## Proposed Directory Structure

```
/src
  /app                        # Next.js App Router
    /api                      # API Routes
      /<resource>             # e.g. users, store, orders
        /route.ts             # Collection endpoints (GET, POST)
        /[id]
          /route.ts           # Item endpoints (GET, PUT, DELETE)
          /<action>           # Custom actions
            /route.ts
    /<feature>                # e.g. portal, profile, store
      /components             # Feature-specific components
      /utils                  # Feature-specific utilities
      /hooks                  # Feature-specific hooks
      /page.tsx               # Page component
      /layout.tsx             # Feature layout
  /components
    /common                   # Shared components (buttons, inputs, etc.)
    /layouts                  # Layout components
    /ui                       # UI components (cards, modals, etc.)
  /context                    # React context providers
  /hooks                      # Shared custom hooks
  /lib                        # External library integrations
  /types                      # Shared TypeScript types
  /utils                      # Shared utility functions
```

## File Naming Conventions

- **Components**: PascalCase, e.g., `ProductCard.tsx`
- **Pages/Layouts**: camelCase, e.g., `page.tsx`, `layout.tsx`
- **Utilities**: camelCase, e.g., `formatDate.ts`
- **CSS Modules**: PascalCase.module.css, e.g., `ProductCard.module.css`
- **Types**: PascalCase, e.g., `Product.ts` containing `interface Product {}`
- **Context**: PascalCase, e.g., `CartContext.tsx`
- **Hooks**: camelCase with 'use' prefix, e.g., `useCart.ts`

## Implementation Steps

1. Move context folder out of app to src level
2. Reorganize components into common, layouts, and ui folders
3. Organize feature-specific components within their feature folders
4. Standardize API route structure
5. Consolidate utility functions
6. Normalize file naming conventions
7. Create barrel files (index.ts) for easy imports
8. Update import paths throughout the codebase

## Specific Changes

- Move `/app/context/CartContext.tsx` to `/src/context/CartContext.tsx`
- Create barrel files for component exports
- Consolidate utility functions from various locations
- Standardize CSS module naming to match component names
- Update import paths to use `@/` consistently

## Benefits

- Improved code locality - related code stays together
- Better separation of concerns
- Reduced duplication
- Easier navigation and maintenance
- More scalable structure for future growth
- Consistent patterns for better developer experience