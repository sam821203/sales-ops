import { Badge, Dropdown } from 'antd';

const items = [
  { key: '1', label: 'No new notifications' },
];

export default function DropdownNotification() {
  return (
    <li>
      <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-100 hover:text-brand-600 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-brand-400"
        >
          <Badge size="small" count={0} offset={[2, -2]}>
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 17.25C10.0355 17.25 10.875 16.4105 10.875 15.375H7.125C7.125 16.4105 7.96447 17.25 9 17.25Z"
                fill=""
              />
              <path
                d="M15.75 13.5H2.25C1.83579 13.5 1.5 13.1642 1.5 12.75C1.5 12.3358 1.83579 12 2.25 12H2.625V7.5C2.625 4.3934 5.1434 1.875 8.25 1.875H9.75C12.8566 1.875 15.375 4.3934 15.375 7.5V12H15.75C16.1642 12 16.5 12.3358 16.5 12.75C16.5 13.1642 16.1642 13.5 15.75 13.5Z"
                fill=""
              />
            </svg>
          </Badge>
        </button>
      </Dropdown>
    </li>
  );
}

