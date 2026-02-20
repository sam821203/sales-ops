import { useState } from 'react';
import { Avatar, Dropdown } from 'antd';
import type { MenuProps } from 'antd';

const items: MenuProps['items'] = [
  { key: 'profile', label: 'Profile' },
  { key: 'settings', label: 'Settings' },
  { type: 'divider' },
  { key: 'logout', label: 'Logout' },
];

export default function DropdownUser() {
  const [open, setOpen] = useState(false);

  return (
    <Dropdown
      menu={{ items }}
      trigger={['click']}
      placement="bottomRight"
      open={open}
      onOpenChange={setOpen}
      getPopupContainer={() =>
        document.getElementById('header-dropdown-root') || document.body
      }
    >
      <button
        type="button"
        className="flex cursor-pointer items-center text-gray-700 dark:text-gray-400"
      >
        <span className="mr-3 h-11 w-11 overflow-hidden rounded-full">
          <Avatar size={44} style={{ backgroundColor: '#3C50E0' }}>
            U
          </Avatar>
        </span>
        <span className="mr-1 block text-sm font-medium">User</span>
        <svg
          className={`stroke-gray-500 transition-transform duration-200 dark:stroke-gray-400 ${
            open ? 'rotate-180' : ''
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </Dropdown>
  );
}
