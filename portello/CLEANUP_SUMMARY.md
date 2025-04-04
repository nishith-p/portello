# Codebase Cleanup Summary

## Removed Duplicated Files

The following files and directories were removed after their contents were moved to better locations during our restructuring effort:

### 1. Context Related
- `/src/app/context/CartContext.tsx` → Moved to `/src/context/CartContext.tsx`

### 2. Profile Components
- `/src/app/portal/profile/components/ProfileHeader.tsx` → Moved to `/src/components/profile/ProfileHeader.tsx`
- `/src/app/portal/profile/components/BasicInformationForm.tsx` → Moved to `/src/components/profile/BasicInformationForm.tsx`
- `/src/app/portal/profile/components/AdditionalInformationForm.tsx` → Moved to `/src/components/profile/AdditionalInformationForm.tsx`

### 3. Profile Utils
- `/src/app/portal/profile/utils/hooks.ts` → Moved to `/src/lib/hooks/profile/useBasicInfoForm.ts`
- `/src/app/portal/profile/utils/schemas.ts` → Moved to `/src/lib/hooks/profile/schemas.ts`
- `/src/app/portal/profile/utils/constants.ts` → Removed (empty file)

### 4. Store Components
- `/src/app/portal/store/components/ProductCard.tsx` → Moved to `/src/components/ui/ProductCard.tsx`
- `/src/app/portal/store/components/ProductModal.tsx` → Moved to `/src/components/ui/ProductModal.tsx`
- `/src/app/portal/store/types.ts` → Moved to `/src/types/store.ts`

### 5. Layout Components
- `/src/app/portal/components/common/LayoutShell.tsx` → Moved to `/src/components/layouts/LayoutShell.tsx`
- `/src/app/portal/components/common/PortalHeader.tsx` → Moved to `/src/components/layouts/PortalHeader.tsx`
- `/src/app/portal/components/common/PortalSidebar.tsx` → Moved to `/src/components/layouts/PortalSidebar.tsx`
- `/src/app/portal/components/common/styles/PortalSidebar.module.css` → Moved to `/src/components/layouts/PortalSidebar.module.css`

### 6. Cart Components
- `/src/app/portal/components/cart/CartDrawer.tsx` → Moved to `/src/components/ui/CartDrawer.tsx`

### 7. API Utils
- `/src/app/api/utils/auth.ts` → Moved to `/src/lib/api/middleware/auth.ts`
- `/src/app/api/utils/db.ts` → Split into multiple service files in `/src/lib/api/services/`

## Benefits of Cleanup

1. **Reduced Duplication**: Eliminated redundant code by centralizing components and utilities
2. **Clearer Structure**: All components, hooks, and utilities now have a consistent home
3. **Improved Maintainability**: Easier to find and modify code with logical organization
4. **Better Code Navigation**: Related functionality is now grouped together
5. **Streamlined Imports**: Simplified import paths with organized barrel files