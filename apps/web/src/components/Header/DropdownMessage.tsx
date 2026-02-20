import { Dropdown } from 'antd';

const items = [{ key: '1', label: 'No new messages' }];

export default function DropdownMessage() {
  return (
    <div className="relative">
      <Dropdown
        menu={{ items }}
        trigger={['click']}
        placement="bottomRight"
        getPopupContainer={() =>
          document.getElementById('header-dropdown-root') || document.body
        }
      >
        <button
          type="button"
          className="relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          <svg
            className="fill-current"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.75 3H2.25C1.83579 3 1.5 3.33579 1.5 3.75V12.75C1.5 13.1642 1.83579 13.5 2.25 13.5H5.25V15.75C5.25 16.1642 5.58579 16.5 6 16.5C6.16841 16.5 6.33215 16.4433 6.465 16.3395L10.5 13.5H15.75C16.1642 13.5 16.5 13.1642 16.5 12.75V3.75C16.5 3.33579 16.1642 3 15.75 3ZM15 12H10.227L6.75 14.448V12.75C6.75 12.3358 6.41421 12 6 12H3V4.5H15V12Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </Dropdown>
    </div>
  );
}
