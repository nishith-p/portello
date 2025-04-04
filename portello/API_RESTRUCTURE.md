# API Restructuring Guide

## New API Structure

```
/src
  /lib
    /api                    # Centralized API utilities
      /middleware           # Request middleware
        /auth.ts            # Authentication middleware
      /services             # Data services
        /store.ts           # Store item services
        /orders.ts          # Order services
        /users.ts           # User services
        /index.ts           # Re-exports all services
      /validators           # Request validators
        /store.ts           # Store validation
        /orders.ts          # Order validation
        /index.ts           # Re-exports all validators
      /errors.ts            # Error handling utilities
      /index.ts             # Re-exports all API utilities
```

## Key Improvements

1. **Structured Error Handling**
   - Custom error classes for different error types (Authentication, Authorization, Validation, etc.)
   - Standardized error responses with proper HTTP status codes
   - Detailed error information for debugging

2. **Authentication/Authorization Middleware**
   - Centralized authentication checks with `withAuth` middleware
   - Role-based authorization (admin vs. regular users)
   - Resource ownership validation

3. **Service Layer**
   - Separation of database operations from route handlers
   - Reusable data access functions
   - Better error handling in data operations

4. **Input Validation**
   - Dedicated validators for different data types
   - Detailed validation error messages
   - Prevent invalid data from reaching the database

5. **Code Organization**
   - Clear separation of concerns
   - Improved maintainability
   - Better reusability across routes

## Usage Example

```typescript
// API route handler
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      // Use services to get data
      const items = await getStoreItems();
      return NextResponse.json(items);
    } catch (error) {
      // Standardized error handling
      return errorResponse(error as Error);
    }
  }, {
    requireAuth: true,
    requireAdmin: false
  });
}
```

## Benefits

1. **Consistent Error Handling**
   - Better user experience with meaningful error messages
   - Easier debugging with standardized error format

2. **Improved Security**
   - Centralized auth checks prevent oversight
   - Proper validation reduces attack surface

3. **Code Reusability**
   - Share logic between different API routes
   - Reduce duplication with centralized services

4. **Maintainability**
   - Clear organization makes code easier to understand
   - New features can be added without modifying existing code

5. **Testability**
   - Services can be tested independently
   - Routes can be mocked for component testing