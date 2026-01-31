export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-md2 font-semibold text-black dark:text-white">
          Dashboard
        </h1>
        <p className="text-body dark:text-bodydark">
          Welcome to SalesOps. This layout & theme matches the SalesOps design system.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {['Leads', 'Opportunities', 'Accounts', 'Revenue'].map((label) => (
          <div
            key={label}
            className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark"
          >
            <p className="text-sm font-medium text-body dark:text-bodydark">{label}</p>
            <p className="mt-1 text-title-md font-semibold text-black dark:text-white">—</p>
          </div>
        ))}
      </div>
    </div>
  );
}

