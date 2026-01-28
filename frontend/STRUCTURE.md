# WiseSpend Frontend Structure

This document outlines the folder structure for the WiseSpend dashboard application.

## Folder Organization

### `/app` - Landing Page
The root `/app` folder contains the public landing page:

- `/app/page.tsx` - Landing page (public/marketing page)
- `/app/layout.tsx` - Root layout (for landing page only)

### `/app/dashboard` - Dashboard Application
All authenticated dashboard pages are nested under `/app/dashboard`:

- `/app/dashboard/layout.tsx` - Dashboard layout (includes Sidebar, Header, FloatingActionButton)
- `/app/dashboard/page.tsx` - Dashboard page (main dashboard)
- `/app/dashboard/transactions/page.tsx` - Transactions page
- `/app/dashboard/analytics/page.tsx` - Analytics page
- `/app/dashboard/goals/page.tsx` - Goals page
- `/app/dashboard/ai-coach/page.tsx` - AI Coach page
- `/app/dashboard/settings/page.tsx` - Settings page

Each page folder contains a `page.tsx` file that serves as the route component.

### `/components` - React Components

#### `/components/layout/` - Shared Layout Components
- `Sidebar.tsx` - Navigation sidebar with all page links
- `Header.tsx` - Top header with user info and notifications
- `FloatingActionButton.tsx` - Floating action button (bottom right)

#### `/components/dashboard/` - Dashboard-Specific Components
- `FinancialSummaryCards.tsx` - Top row of summary cards (Emergency Fund, Monthly Spending, Wise Score, Snap Receipt)
- `TransactionList.tsx` - Recent transactions list
- `SocraticCoach.tsx` - AI coach card with insights
- `FinancialResilienceChart.tsx` - Financial resilience path chart

#### `/components/transactions/` - Transaction Page Components
*(To be created when working on transactions page)*

#### `/components/analytics/` - Analytics Page Components
*(To be created when working on analytics page)*

#### `/components/goals/` - Goals Page Components
*(To be created when working on goals page)*

#### `/components/ai-coach/` - AI Coach Page Components
*(To be created when working on AI coach page)*

#### `/components/settings/` - Settings Page Components
*(To be created when working on settings page)*

## Working on a Page

When working on a specific page (e.g., Transactions):

1. Navigate to `/app/dashboard/transactions/page.tsx` - This is the main page component
2. Create page-specific components in `/components/transactions/` folder
3. Import and use shared components from `/components/layout/` as needed
4. The Sidebar will automatically highlight the active page based on the current route
5. All dashboard pages share the same layout (Sidebar, Header, FloatingActionButton) defined in `/app/dashboard/layout.tsx`

## Styling

- Tailwind CSS v4 is used for styling
- Custom theme colors are defined in `/app/globals.css`
- Material Icons are loaded via Google Fonts CDN
- Outfit font family is used for typography

## Routing

- Root path (`/`) - Landing page (public)
- `/dashboard` - Main dashboard page
- `/dashboard/transactions` - Transactions page
- `/dashboard/analytics` - Analytics page
- `/dashboard/goals` - Goals page
- `/dashboard/ai-coach` - AI Coach page
- `/dashboard/settings` - Settings page
- All routes use Next.js App Router file-based routing
- Active route highlighting is handled automatically by the Sidebar component
- Dashboard layout (Sidebar, Header) is shared across all `/dashboard/*` routes via `/app/dashboard/layout.tsx`
