import { Avatar, Dropdown } from 'antd';
import type { MenuProps } from 'antd';

const items: MenuProps['items'] = [
  { key: 'profile', label: 'Profile' },
  { key: 'settings', label: 'Settings' },
  { type: 'divider' },
  { key: 'logout', label: 'Logout' },
];

export default function DropdownUser() {
  return (
    <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
      <button
        type="button"
        className="flex items-center gap-3 rounded-md px-2 py-1.5 hover:bg-gray-2 dark:hover:bg-meta-4"
      >
        <Avatar size={32} style={{ backgroundColor: '#3C50E0' }}>
          U
        </Avatar>
        <div className="hidden text-left lg:block">
          <p className="text-sm font-medium text-black dark:text-white">User</p>
          <p className="text-xs text-body dark:text-bodydark">Admin</p>
        </div>
        <svg
          className="hidden fill-current sm:block"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410744 0.910704C0.736181 0.585266 1.26382 0.585266 1.58926 0.910704L6 5.32145L10.4107 0.910704C10.7362 0.585266 11.2638 0.585266 11.5893 0.910704C11.9147 1.23614 11.9147 1.76378 11.5893 2.08922L6.58926 7.08922C6.26382 7.41466 5.73618 7.41466 5.41074 7.08922L0.410744 2.08922C0.085307 1.76378 0.085307 1.23614 0.410744 0.910704Z"
            fill=""
          />
        </svg>
      </button>
    </Dropdown>
  );
}

