import { useEffect, useRef, useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import {
  DashboardOutlined,
  DollarOutlined,
  DownOutlined,
  FileSearchOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import SidebarLinkGroup from './SidebarLinkGroup';

const ecommercePaths = [
  '/products',
  '/product-management',
  '/price-history',
  '/inventory-adjustment',
  '/orders',
  '/order-status-history',
  '/promotions',
  '/promotion-status',
];

const financePaths = ['/payment-transactions', '/vendor-commission', '/refunds'];

type GroupLink = {
  to: string;
  label: string;
};

function GroupLinks(props: {
  open: boolean;
  pathname: string;
  links: GroupLink[];
}) {
  return (
    <div
      className={`grid overflow-hidden transition-[grid-template-rows] duration-200 ease-in-out ${
        props.open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
      }`}
    >
      <div className="overflow-hidden">
        <ul
          className={`ml-9 mt-2 flex flex-col gap-1 transition-all duration-200 ease-in-out ${
            props.open ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0'
          }`}
        >
          {props.links.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`menu-dropdown-item ${
                  props.pathname === link.to
                    ? 'menu-dropdown-item-active'
                    : 'menu-dropdown-item-inactive'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Sidebar(props: {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isDashboardActive =
    pathname === '/' || pathname === '/dashboard' || pathname.startsWith('/dashboard/');
  const isEcommerceActive = ecommercePaths.some((path) => pathname === path);
  const isFinanceActive = financePaths.some((path) => pathname === path);

  const trigger = useRef<HTMLButtonElement | null>(null);
  const sidebar = useRef<HTMLElement | null>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!sidebar.current || !trigger.current || !target) return;
      if (
        !props.sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      props.setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [props]);

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (!props.sidebarOpen || e.key !== 'Escape') return;
      props.setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [props]);

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) document.querySelector('body')?.classList.add('sidebar-expanded');
    else document.querySelector('body')?.classList.remove('sidebar-expanded');
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-[290px] flex-col overflow-y-hidden border-r border-gray-200 bg-white/95 px-5 backdrop-blur-sm duration-300 ease-linear dark:border-gray-800 dark:bg-gray-900/95 lg:static lg:translate-x-0 ${
        props.sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between py-5">
        <Link to="/">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="SalesOps" className="h-8 w-8" />
            <span className="text-xl font-medium tracking-wide text-gray-900 dark:text-white">
              Sales<span className="text-primary">Ops</span>
            </span>
          </div>
        </Link>

        <button
          ref={trigger}
          onClick={() => props.setSidebarOpen(!props.sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={props.sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mb-6">
          <div>
            <h3 className="mb-3 flex text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1">
              <li>
                <Link
                  to="/dashboard/ecommerce"
                  className={`menu-item group ${
                    isDashboardActive ? 'menu-item-active' : 'menu-item-inactive'
                  }`}
                >
                  <span
                    className={`menu-item-icon-size ${
                      isDashboardActive
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive'
                    }`}
                  >
                    <DashboardOutlined />
                  </span>
                  <span className="font-medium">Dashboard</span>
                </Link>
              </li>

              <li>
                <SidebarLinkGroup activeCondition={isEcommerceActive}>
                  {(handleClick, open) => (
                    <>
                      <a
                        href="#"
                        className={`menu-item group ${
                          isEcommerceActive ? 'menu-item-active' : 'menu-item-inactive'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          if (sidebarExpanded) handleClick();
                          else setSidebarExpanded(true);
                        }}
                      >
                        <span
                          className={`menu-item-icon-size ${
                            isEcommerceActive
                              ? 'menu-item-icon-active'
                              : 'menu-item-icon-inactive'
                          }`}
                        >
                          <ShoppingCartOutlined />
                        </span>
                        <span className="font-medium">E-commerce</span>
                        <DownOutlined
                          className={`ml-auto h-5 w-5 text-xs transition-transform duration-200 ease-in-out ${
                            open
                              ? 'rotate-180 text-brand-500 dark:text-brand-400'
                              : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300'
                          }`}
                        />
                      </a>
                      <GroupLinks
                        open={open}
                        pathname={pathname}
                        links={[
                          { to: '/products', label: 'Products' },
                          { to: '/product-management', label: 'Product Mgmt' },
                          { to: '/price-history', label: 'Price History' },
                          { to: '/inventory-adjustment', label: 'Inventory' },
                          { to: '/orders', label: 'Orders' },
                          { to: '/order-status-history', label: 'Order History' },
                          { to: '/promotions', label: 'Promotions' },
                          { to: '/promotion-status', label: 'Promo Status' },
                        ]}
                      />
                    </>
                  )}
                </SidebarLinkGroup>
              </li>

              <li>
                <SidebarLinkGroup activeCondition={isFinanceActive}>
                  {(handleClick, open) => (
                    <>
                      <a
                        href="#"
                        className={`menu-item group ${
                          isFinanceActive ? 'menu-item-active' : 'menu-item-inactive'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          if (sidebarExpanded) handleClick();
                          else setSidebarExpanded(true);
                        }}
                      >
                        <span
                          className={`menu-item-icon-size ${
                            isFinanceActive
                              ? 'menu-item-icon-active'
                              : 'menu-item-icon-inactive'
                          }`}
                        >
                          <DollarOutlined />
                        </span>
                        <span className="font-medium">Finance</span>
                        <DownOutlined
                          className={`ml-auto h-5 w-5 text-xs transition-transform duration-200 ease-in-out ${
                            open
                              ? 'rotate-180 text-brand-500 dark:text-brand-400'
                              : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300'
                          }`}
                        />
                      </a>
                      <GroupLinks
                        open={open}
                        pathname={pathname}
                        links={[
                          { to: '/payment-transactions', label: 'Payments' },
                          { to: '/vendor-commission', label: 'Commissions' },
                          { to: '/refunds', label: 'Refunds' },
                        ]}
                      />
                    </>
                  )}
                </SidebarLinkGroup>
              </li>

              <li>
                <Link
                  to="/audit-log"
                  className={`menu-item group ${
                    pathname === '/audit-log'
                      ? 'menu-item-active'
                      : 'menu-item-inactive'
                  }`}
                >
                  <span
                    className={`menu-item-icon-size ${
                      pathname === '/audit-log'
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive'
                    }`}
                  >
                    <FileSearchOutlined />
                  </span>
                  <span className="font-medium">Audit Log</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
}
