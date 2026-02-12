import { useEffect, useRef, useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import {
  AppstoreOutlined,
  BarChartOutlined,
  CalendarOutlined,
  DashboardOutlined,
  DownOutlined,
  FormOutlined,
  LockOutlined,
  SettingOutlined,
  TableOutlined,
  UserOutlined,
} from '@ant-design/icons';
import SidebarLinkGroup from './SidebarLinkGroup';

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

  // close on click outside
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

  // close if the esc key is pressed
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
      {/* <!-- SIDEBAR HEADER --> */}
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
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-body dark:text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Dashboard --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === '/' ||
                  pathname === '/dashboard' ||
                  pathname.startsWith('/dashboard/')
                }
              >
                {(handleClick, open) => (
                  <>
                    <a
                      href="#"
                      className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-body duration-300 ease-in-out hover:bg-gray dark:text-bodydark1 dark:hover:bg-meta-4 ${
                        (pathname === '/' ||
                          pathname === '/dashboard' ||
                          pathname.startsWith('/dashboard/')) &&
                        'bg-gray dark:bg-meta-4'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (sidebarExpanded) handleClick();
                        else setSidebarExpanded(true);
                      }}
                    >
                      <DashboardOutlined className="text-[18px]" />
                      Dashboard
                      <DownOutlined
                        className={`absolute right-4 top-1/2 -translate-y-1/2 text-[14px] transition-transform duration-200 ease-in-out ${
                          open ? 'rotate-180' : ''
                        }`}
                      />
                    </a>
                    <div
                      className={`grid overflow-hidden transition-[grid-template-rows] duration-200 ease-in-out ${
                        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <ul
                          className={`mb-5.5 mt-4 flex flex-col gap-2.5 pl-6 transition-all duration-200 ease-in-out ${
                            open ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0'
                          }`}
                        >
                          <li>
                            <Link
                              to="/dashboard/ecommerce"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-body duration-300 ease-in-out hover:text-black dark:text-bodydark2 dark:hover:text-white ${
                                (pathname === '/dashboard/ecommerce' || pathname === '/') &&
                                '!text-black dark:!text-white'
                              }`}
                            >
                              eCommerce
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/dashboard/analytics"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-body duration-300 ease-in-out hover:text-black dark:text-bodydark2 dark:hover:text-white ${
                                pathname === '/dashboard/analytics' && '!text-black dark:!text-white'
                              }`}
                            >
                              Analytics
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/dashboard/crm"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-body duration-300 ease-in-out hover:text-black dark:text-bodydark2 dark:hover:text-white ${
                                pathname === '/dashboard/crm' && '!text-black dark:!text-white'
                              }`}
                            >
                              CRM
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/dashboard/sales"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-body duration-300 ease-in-out hover:text-black dark:text-bodydark2 dark:hover:text-white ${
                                pathname === '/dashboard/sales' && '!text-black dark:!text-white'
                              }`}
                            >
                              Sales
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/dashboard/reports"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-body duration-300 ease-in-out hover:text-black dark:text-bodydark2 dark:hover:text-white ${
                                pathname === '/dashboard/reports' && '!text-black dark:!text-white'
                              }`}
                            >
                              Reports
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </>
                )}
              </SidebarLinkGroup>
              {/* <!-- Menu Item Dashboard --> */}

              <li>
                <Link
                  to="/calendar"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-body duration-300 ease-in-out hover:bg-gray dark:text-bodydark1 dark:hover:bg-meta-4 ${
                    pathname.includes('calendar') && 'bg-gray dark:bg-meta-4'
                  }`}
                >
                  <CalendarOutlined className="text-[18px]" />
                  Calendar
                </Link>
              </li>

              <li>
                <Link
                  to="/profile"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-body duration-300 ease-in-out hover:bg-gray dark:text-bodydark1 dark:hover:bg-meta-4 ${
                    pathname.includes('profile') && 'bg-gray dark:bg-meta-4'
                  }`}
                >
                  <UserOutlined className="text-[18px]" />
                  Profile
                </Link>
              </li>

              <li>
                <Link
                  to="/settings"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-body duration-300 ease-in-out hover:bg-gray dark:text-bodydark1 dark:hover:bg-meta-4 ${
                    pathname.includes('settings') && 'bg-gray dark:bg-meta-4'
                  }`}
                >
                  <SettingOutlined className="text-[18px]" />
                  Settings
                </Link>
              </li>

              {/* <!-- Menu Item Forms --> */}
              <SidebarLinkGroup
                activeCondition={pathname === '/forms' || pathname.includes('forms')}
              >
                {(handleClick, open) => (
                  <>
                    <a
                      href="#"
                      className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-body duration-300 ease-in-out hover:bg-gray dark:text-bodydark1 dark:hover:bg-meta-4 ${
                        (pathname === '/forms' || pathname.includes('forms')) &&
                        'bg-gray dark:bg-meta-4'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (sidebarExpanded) handleClick();
                        else setSidebarExpanded(true);
                      }}
                    >
                      <FormOutlined className="text-[18px]" />
                      Forms
                      <DownOutlined
                        className={`absolute right-4 top-1/2 -translate-y-1/2 text-[14px] transition-transform duration-200 ease-in-out ${
                          open ? 'rotate-180' : ''
                        }`}
                      />
                    </a>
                    <div
                      className={`grid overflow-hidden transition-[grid-template-rows] duration-200 ease-in-out ${
                        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <ul
                          className={`mb-5.5 mt-4 flex flex-col gap-2.5 pl-6 transition-all duration-200 ease-in-out ${
                            open ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0'
                          }`}
                        >
                        <li>
                          <Link
                            to="/forms/form-elements"
                            className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-body duration-300 ease-in-out hover:text-black dark:text-bodydark2 dark:hover:text-white ${
                              pathname.includes('form-elements') && '!text-black dark:!text-white'
                            }`}
                          >
                            Form Elements
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/forms/form-layout"
                            className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-body duration-300 ease-in-out hover:text-black dark:text-bodydark2 dark:hover:text-white ${
                              pathname.includes('form-layout') && '!text-black dark:!text-white'
                            }`}
                          >
                            Form Layout
                          </Link>
                        </li>
                        </ul>
                      </div>
                    </div>
                  </>
                )}
              </SidebarLinkGroup>
              {/* <!-- Menu Item Forms --> */}

              <li>
                <Link
                  to="/tables"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-body duration-300 ease-in-out hover:bg-gray dark:text-bodydark1 dark:hover:bg-meta-4 ${
                    pathname.includes('tables') && 'bg-gray dark:bg-meta-4'
                  }`}
                >
                  <TableOutlined className="text-[18px]" />
                  Tables
                </Link>
              </li>
            </ul>
          </div>

          {/* <!-- Others Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-body dark:text-bodydark2">
              OTHERS
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
                <Link
                  to="/chart"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-body duration-300 ease-in-out hover:bg-gray dark:text-bodydark1 dark:hover:bg-meta-4 ${
                    pathname.includes('chart') && 'bg-gray dark:bg-meta-4'
                  }`}
                >
                  <BarChartOutlined className="text-[18px]" />
                  Chart
                </Link>
              </li>

              <SidebarLinkGroup activeCondition={pathname === '/ui' || pathname.includes('ui')}>
                {(handleClick, open) => (
                  <>
                    <a
                      href="#"
                      className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-body duration-300 ease-in-out hover:bg-gray dark:text-bodydark1 dark:hover:bg-meta-4 ${
                        (pathname === '/ui' || pathname.includes('ui')) &&
                        'bg-gray dark:bg-meta-4'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (sidebarExpanded) handleClick();
                        else setSidebarExpanded(true);
                      }}
                    >
                      <AppstoreOutlined className="text-[18px]" />
                      UI Elements
                      <DownOutlined
                        className={`absolute right-4 top-1/2 -translate-y-1/2 text-[14px] transition-transform duration-200 ease-in-out ${
                          open ? 'rotate-180' : ''
                        }`}
                      />
                    </a>
                    <div
                      className={`grid overflow-hidden transition-[grid-template-rows] duration-200 ease-in-out ${
                        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <ul
                          className={`mb-5.5 mt-4 flex flex-col gap-2.5 pl-6 transition-all duration-200 ease-in-out ${
                            open ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0'
                          }`}
                        >
                        <li>
                          <Link
                            to="/ui/alerts"
                            className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-body duration-300 ease-in-out hover:text-black dark:text-bodydark2 dark:hover:text-white ${
                              pathname.includes('/ui/alerts') && '!text-black dark:!text-white'
                            }`}
                          >
                            Alerts
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/ui/buttons"
                            className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-body duration-300 ease-in-out hover:text-black dark:text-bodydark2 dark:hover:text-white ${
                              pathname.includes('/ui/buttons') && '!text-black dark:!text-white'
                            }`}
                          >
                            Buttons
                          </Link>
                        </li>
                        </ul>
                      </div>
                    </div>
                  </>
                )}
              </SidebarLinkGroup>

              <SidebarLinkGroup
                activeCondition={pathname === '/auth' || pathname.includes('auth')}
              >
                {(handleClick, open) => (
                  <>
                    <a
                      href="#"
                      className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-body duration-300 ease-in-out hover:bg-gray dark:text-bodydark1 dark:hover:bg-meta-4 ${
                        (pathname === '/auth' || pathname.includes('auth')) &&
                        'bg-gray dark:bg-meta-4'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (sidebarExpanded) handleClick();
                        else setSidebarExpanded(true);
                      }}
                    >
                      <LockOutlined className="text-[18px]" />
                      Authentication
                      <DownOutlined
                        className={`absolute right-4 top-1/2 -translate-y-1/2 text-[14px] transition-transform duration-200 ease-in-out ${
                          open ? 'rotate-180' : ''
                        }`}
                      />
                    </a>
                    <div
                      className={`grid overflow-hidden transition-[grid-template-rows] duration-200 ease-in-out ${
                        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <ul
                          className={`mb-5.5 mt-4 flex flex-col gap-2.5 pl-6 transition-all duration-200 ease-in-out ${
                            open ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0'
                          }`}
                        >
                        <li>
                          <Link
                            to="/auth/signin"
                            className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-body duration-300 ease-in-out hover:text-black dark:text-bodydark2 dark:hover:text-white ${
                              pathname.includes('/auth/signin') && '!text-black dark:!text-white'
                            }`}
                          >
                            Sign In
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/auth/signup"
                            className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-body duration-300 ease-in-out hover:text-black dark:text-bodydark2 dark:hover:text-white ${
                              pathname.includes('/auth/signup') && '!text-black dark:!text-white'
                            }`}
                          >
                            Sign Up
                          </Link>
                        </li>
                        </ul>
                      </div>
                    </div>
                  </>
                )}
              </SidebarLinkGroup>
            </ul>
          </div>
          {/* <!-- Others Group --> */}
        </nav>
      </div>
    </aside>
  );
}

