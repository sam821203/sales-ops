import { Outlet } from '@tanstack/react-router';
import { SidebarProvider, useSidebar } from '@/context/SidebarContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Backdrop from '@/components/Backdrop';

function LayoutContent() {
  const { isExpanded, isHovered } = useSidebar();
  const sidebarWide = isExpanded || isHovered;

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <Backdrop />

        <div
          className={`relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden transition-[margin] duration-300 ${
            sidebarWide ? 'lg:ml-[290px]' : 'lg:ml-[90px]'
          }`}
        >
          <div
            id="header-dropdown-root"
            className="pointer-events-none fixed inset-0 z-[100000]"
            aria-hidden
          />
          <Header />
          <main className="flex-1 min-h-0">
            <div className="mx-auto flex h-full min-h-0 flex-col p-4 md:p-6">
              <div className="flex min-h-0 flex-1 flex-col">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export function DefaultLayout() {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
}