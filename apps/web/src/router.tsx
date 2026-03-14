import { createLazyRoute, createRootRoute, createRoute, createRouter, redirect } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { productsSearchSchema } from '@/schemas/productsSearch';
import App from '@/App';

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
}).lazy(() => import('@/views/ECommercePage').then((m) => createLazyRoute('/dashboard/ecommerce')({ component: m.ECommercePage })));

const dashboardAnalyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/analytics',
}).lazy(() => import('@/views/DashboardAnalyticsPage').then((m) => createLazyRoute('/dashboard/analytics')({ component: m.DashboardAnalyticsPage })));

const dashboardCrmRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/crm',
}).lazy(() => import('@/views/DashboardCrmPage').then((m) => createLazyRoute('/dashboard/crm')({ component: m.DashboardCrmPage })));

const dashboardSalesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/sales',
}).lazy(() => import('@/views/DashboardSalesPage').then((m) => createLazyRoute('/dashboard/sales')({ component: m.DashboardSalesPage })));

const dashboardReportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/reports',
}).lazy(() => import('@/views/DashboardReportsPage').then((m) => createLazyRoute('/dashboard/reports')({ component: m.DashboardReportsPage })));

const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calendar',
}).lazy(() => import('@/views/CalendarPage').then((m) => createLazyRoute('/calendar')({ component: m.CalendarPage })));

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
}).lazy(() => import('@/views/ProfilePage').then((m) => createLazyRoute('/profile')({ component: m.ProfilePage })));

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
}).lazy(() => import('@/views/SettingsPage').then((m) => createLazyRoute('/settings')({ component: m.SettingsPage })));

const tablesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tables',
}).lazy(() => import('@/views/TablesPage').then((m) => createLazyRoute('/tables')({ component: m.TablesPage })));

const chartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chart',
}).lazy(() => import('@/views/ChartPage').then((m) => createLazyRoute('/chart')({ component: m.ChartPage })));

const alertsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ui/alerts',
}).lazy(() => import('@/views/AlertsPage').then((m) => createLazyRoute('/ui/alerts')({ component: m.AlertsPage })));

const buttonsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ui/buttons',
}).lazy(() => import('@/views/ButtonsPage').then((m) => createLazyRoute('/ui/buttons')({ component: m.ButtonsPage })));

const formElementsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forms/form-elements',
}).lazy(() => import('@/views/FormElementsPage').then((m) => createLazyRoute('/forms/form-elements')({ component: m.FormElementsPage })));

const formLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forms/form-layout',
}).lazy(() => import('@/views/FormLayoutPage').then((m) => createLazyRoute('/forms/form-layout')({ component: m.FormLayoutPage })));

const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/signin',
}).lazy(() => import('@/views/SignInPage').then((m) => createLazyRoute('/auth/signin')({ component: m.SignInPage })));

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
}).lazy(() => import('@/views/LoginPage').then((m) => createLazyRoute('/login')({ component: m.LoginPage })));

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/signup',
}).lazy(() => import('@/views/SignUpPage').then((m) => createLazyRoute('/auth/signup')({ component: m.SignUpPage })));

const ecommerceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ecommerce',
});

const productsRoute = createRoute({
  getParentRoute: () => ecommerceRoute,
  path: 'products',
  validateSearch: zodValidator(productsSearchSchema),
}).lazy(() => import('@/views/Products').then((m) => createLazyRoute('/ecommerce/products')({ component: m.ProductsPage })));

const productDetailRoute = createRoute({
  getParentRoute: () => ecommerceRoute,
  path: 'product/$productId',
}).lazy(() => import('@/views/ProductDetailPage').then((m) => createLazyRoute('/ecommerce/product/$productId')({ component: m.ProductDetailPage })));

const priceHistoryRoute = createRoute({
  getParentRoute: () => ecommerceRoute,
  path: 'price-history',
}).lazy(() => import('@/views/PriceHistoryPage').then((m) => createLazyRoute('/ecommerce/price-history')({ component: m.PriceHistoryPage })));

const inventoryAdjustmentRoute = createRoute({
  getParentRoute: () => ecommerceRoute,
  path: 'inventory-adjustment',
}).lazy(() => import('@/views/InventoryAdjustmentPage').then((m) => createLazyRoute('/ecommerce/inventory-adjustment')({ component: m.InventoryAdjustmentPage })));

const ordersRoute = createRoute({
  getParentRoute: () => ecommerceRoute,
  path: 'orders',
}).lazy(() => import('@/views/OrdersPage').then((m) => createLazyRoute('/ecommerce/orders')({ component: m.OrdersPage })));

const orderStatusHistoryRoute = createRoute({
  getParentRoute: () => ecommerceRoute,
  path: 'order-status-history',
}).lazy(() => import('@/views/OrderStatusHistoryPage').then((m) => createLazyRoute('/ecommerce/order-status-history')({ component: m.OrderStatusHistoryPage })));

const promotionsRoute = createRoute({
  getParentRoute: () => ecommerceRoute,
  path: 'promotions',
}).lazy(() => import('@/views/PromotionsPage').then((m) => createLazyRoute('/ecommerce/promotions')({ component: m.PromotionsPage })));

const promotionStatusRoute = createRoute({
  getParentRoute: () => ecommerceRoute,
  path: 'promotion-status',
}).lazy(() => import('@/views/PromotionStatusPage').then((m) => createLazyRoute('/ecommerce/promotion-status')({ component: m.PromotionStatusPage })));

const financeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/finance',
});

const paymentTransactionsRoute = createRoute({
  getParentRoute: () => financeRoute,
  path: 'payment-transactions',
}).lazy(() => import('@/views/PaymentTransactionsPage').then((m) => createLazyRoute('/finance/payment-transactions')({ component: m.PaymentTransactionsPage })));

const vendorCommissionRoute = createRoute({
  getParentRoute: () => financeRoute,
  path: 'vendor-commission',
}).lazy(() => import('@/views/VendorCommissionPage').then((m) => createLazyRoute('/finance/vendor-commission')({ component: m.VendorCommissionPage })));

const refundsRoute = createRoute({
  getParentRoute: () => financeRoute,
  path: 'refunds',
}).lazy(() => import('@/views/RefundsPage').then((m) => createLazyRoute('/finance/refunds')({ component: m.RefundsPage })));

const auditLogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/audit-log',
}).lazy(() => import('@/views/AuditLogPage').then((m) => createLazyRoute('/audit-log')({ component: m.AuditLogPage })));

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
  loginRoute,
  signUpRoute,
  ecommerceRoute.addChildren([
    productsRoute,
    productDetailRoute,
    priceHistoryRoute,
    inventoryAdjustmentRoute,
    ordersRoute,
    orderStatusHistoryRoute,
    promotionsRoute,
    promotionStatusRoute,
  ]),
  financeRoute.addChildren([paymentTransactionsRoute, vendorCommissionRoute, refundsRoute]),
  auditLogRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
