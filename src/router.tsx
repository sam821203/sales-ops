import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import App from './App';
import { DashboardPage } from './views/DashboardPage';

const rootRoute = createRootRoute({
  component: App,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

const routeTree = rootRoute.addChildren([dashboardRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
