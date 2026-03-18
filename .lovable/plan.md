

## Plan: Enhance Heatmap, Remove SOS from Admin, Add Emergency Place Management, Add Dark/Light Mode

### 1. Enhanced Crime Heatmap (`src/pages/HeatmapPage.tsx`)
- Add more heatmap data points with Dehradun area names in `src/services/api.ts` (e.g., Clement Town, Mussoorie Road, Doiwala)
- Give each `HeatmapPoint` an optional `areaName` field in `src/types/index.ts`
- Replace basic `bindPopup` with rich `bindTooltip` that shows on hover (not click) — include area name, crime type, risk level, approximate incident count
- Add a sidebar/panel below the map showing area-wise crime statistics summary
- Style the tooltip popups with the glassmorphism design language

### 2. Remove SOS from Admin (`src/components/SOSButton.tsx`, `src/App.tsx`)
- Conditionally hide the `<SOSButton />` in `App.tsx` by checking `useAuth()` — only render when user is NOT admin role
- This keeps it visible for citizens and unauthenticated users, but hides it on admin views

### 3. Admin: Add Emergency Services (`src/pages/AdminDashboard.tsx`, `src/services/api.ts`)
- Add a new tab `"services"` to the admin dashboard tabs
- Build a form (name, type, address, phone, lat, lng) inside that tab for adding new emergency places
- Add `api.addEmergencyService()` method that pushes to the shared `mockEmergencyServices` array
- Show the current services list with delete capability
- New services will appear immediately on the Emergency Services page

### 4. Dark/Light Mode Toggle
- Create a `ThemeContext` (`src/contexts/ThemeContext.tsx`) that manages `dark`/`light` state, persists to `localStorage`, and toggles the `dark` class on `<html>`
- Add a Sun/Moon toggle button in the Navbar (`src/components/Navbar.tsx`)
- Wrap the app with `<ThemeProvider>` in `App.tsx`
- The existing CSS already has `.dark` variables defined in `index.css`, so toggling the class is sufficient

### Files to modify:
- `src/types/index.ts` — add `areaName` to `HeatmapPoint`
- `src/services/api.ts` — enrich heatmap data with area names, add `addEmergencyService`/`removeEmergencyService` methods
- `src/pages/HeatmapPage.tsx` — rich hover tooltips, area stats panel, more visual detail
- `src/components/SOSButton.tsx` — add auth check to hide for admin
- `src/pages/AdminDashboard.tsx` — new "services" tab with add/delete form
- `src/contexts/ThemeContext.tsx` — new file for theme management
- `src/components/Navbar.tsx` — add theme toggle button
- `src/App.tsx` — wrap with ThemeProvider

