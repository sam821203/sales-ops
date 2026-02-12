import { Badge, Dropdown } from 'antd';

const items = [{ key: '1', label: 'No new messages' }];

export default function DropdownMessage() {
  return (
    <li>
      <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
        <button
          type="button"
          className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border border-stroke bg-white text-body hover:text-primary dark:border-strokedark dark:bg-boxdark dark:text-bodydark"
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
                d="M15.75 3H2.25C1.83579 3 1.5 3.33579 1.5 3.75V12.75C1.5 13.1642 1.83579 13.5 2.25 13.5H5.25V15.75C5.25 16.1642 5.58579 16.5 6 16.5C6.16841 16.5 6.33215 16.4433 6.465 16.3395L10.5 13.5H15.75C16.1642 13.5 16.5 13.1642 16.5 12.75V3.75C16.5 3.33579 16.1642 3 15.75 3ZM15 12H10.227L6.75 14.448V12.75C6.75 12.3358 6.41421 12 6 12H3V4.5H15V12Z"
                fill=""
              />
            </svg>
          </Badge>
        </button>
      </Dropdown>
    </li>
  );
}

