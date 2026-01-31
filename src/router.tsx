import { createRootRoute, createRoute, createRouter, redirect } from '@tanstack/react-router';
import App from './App';
import { ECommercePage } from './views/ECommercePage';
import { DashboardAnalyticsPage } from './views/DashboardAnalyticsPage';
import { DashboardCrmPage } from './views/DashboardCrmPage';
import { DashboardSalesPage } from './views/DashboardSalesPage';
import { DashboardReportsPage } from './views/DashboardReportsPage';
import { CalendarPage } from './views/CalendarPage';
import { ProfilePage } from './views/ProfilePage';
import { SettingsPage } from './views/SettingsPage';
import { TablesPage } from './views/TablesPage';
import { ChartPage } from './views/ChartPage';
import { AlertsPage } from './views/AlertsPage';
import { ButtonsPage } from './views/ButtonsPage';
import { FormElementsPage } from './views/FormElementsPage';
import { FormLayoutPage } from './views/FormLayoutPage';
import { SignInPage } from './views/SignInPage';
import { SignUpPage } from './views/SignUpPage';

const rootRoute = createRootRoute({
  component: App,
});

// Keep "/" as the app entry, but redirect to the Dashboard child route (eCommerce),
// matching the reference sidebar structure.
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/dashboard/ecommerce' });
  },
});

const dashboardIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  beforeLoad: () => {
    throw redirect({ to: '/dashboard/ecommerce' });
  },
});

const dashboardECommerceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/ecommerce',
  component: ECommercePage,
});

const dashboardAnalyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/analytics',
  component: DashboardAnalyticsPage,
});

const dashboardCrmRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/crm',
  component: DashboardCrmPage,
});

const dashboardSalesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/sales',
  component: DashboardSalesPage,
});

const dashboardReportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/reports',
  component: DashboardReportsPage,
});

const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calendar',
  component: CalendarPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});

const tablesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tables',
  component: TablesPage,
});

const chartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chart',
  component: ChartPage,
});

const alertsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ui/alerts',
  component: AlertsPage,
});

const buttonsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ui/buttons',
  component: ButtonsPage,
});

const formElementsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forms/form-elements',
  component: FormElementsPage,
});

const formLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forms/form-layout',
  component: FormLayoutPage,
});

const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/signin',
  component: SignInPage,
});

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/signup',
  component: SignUpPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardIndexRoute,
  dashboardECommerceRoute,
  dashboardAnalyticsRoute,
  dashboardCrmRoute,
  dashboardSalesRoute,
  dashboardReportsRoute,
  calendarRoute,
  profileRoute,
  settingsRoute,
  tablesRoute,
  chartRoute,
  alertsRoute,
  buttonsRoute,
  formElementsRoute,
  formLayoutRoute,
  signInRoute,
  signUpRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
