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
          className={`mb-5.5 mt-4 flex flex-col gap-2.5 pl-6 transition-all duration-200 ease-in-out ${
            props.open ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0'
          }`}
        >
          {props.links.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-body duration-300 ease-in-out hover:text-black dark:text-bodydark2 dark:hover:text-white ${
                  props.pathname === link.to && '!text-black dark:!text-white'
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
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden border-r border-stroke bg-white duration-300 ease-linear dark:border-strokedark dark:bg-boxdark lg:static lg:translate-x-0 ${
        props.sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <Link to="/">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="SalesOps" className="h-8 w-8" />
            <span className="text-2xl font-semibold tracking-wide text-black dark:text-white">
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
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-body dark:text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
                <Link
                  to="/dashboard/ecommerce"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-body duration-300 ease-in-out hover:bg-gray dark:text-bodydark1 dark:hover:bg-meta-4 ${
                    (pathname === '/' ||
                      pathname === '/dashboard' ||
                      pathname.startsWith('/dashboard/')) &&
                    'bg-gray dark:bg-meta-4'
                  }`}
                >
                  <DashboardOutlined className="text-[18px]" />
                  Dashboard
                </Link>
              </li>

              <SidebarLinkGroup
                activeCondition={ecommercePaths.some((path) => pathname === path)}
              >
                {(handleClick, open) => (
                  <>
                    <a
                      href="#"
                      className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-body duration-300 ease-in-out hover:bg-gray dark:text-bodydark1 dark:hover:bg-meta-4 ${
                        ecommercePaths.some((path) => pathname === path) &&
                        'bg-gray dark:bg-meta-4'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (sidebarExpanded) handleClick();
                        else setSidebarExpanded(true);
                      }}
                    >
                      <ShoppingCartOutlined className="text-[18px]" />
                      E-commerce
                      <DownOutlined
                        className={`absolute right-4 top-1/2 -translate-y-1/2 text-[14px] transition-transform duration-200 ease-in-out ${
                          open ? 'rotate-180' : ''
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

              <SidebarLinkGroup activeCondition={financePaths.some((path) => pathname === path)}>
                {(handleClick, open) => (
                  <>
                    <a
                      href="#"
                      className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-body duration-300 ease-in-out hover:bg-gray dark:text-bodydark1 dark:hover:bg-meta-4 ${
                        financePaths.some((path) => pathname === path) &&
                        'bg-gray dark:bg-meta-4'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (sidebarExpanded) handleClick();
                        else setSidebarExpanded(true);
                      }}
                    >
                      <DollarOutlined className="text-[18px]" />
                      Finance
                      <DownOutlined
                        className={`absolute right-4 top-1/2 -translate-y-1/2 text-[14px] transition-transform duration-200 ease-in-out ${
                          open ? 'rotate-180' : ''
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

              <li>
                <Link
                  to="/audit-log"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-body duration-300 ease-in-out hover:bg-gray dark:text-bodydark1 dark:hover:bg-meta-4 ${
                    pathname === '/audit-log' && 'bg-gray dark:bg-meta-4'
                  }`}
                >
                  <FileSearchOutlined className="text-[18px]" />
                  Audit Log
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
}
