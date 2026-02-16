import type { SorterResult } from 'antd/es/table/interface';
import { useMemo, useState } from 'react';
import type { SKU, ProductStatus } from '@salesops/shared';
import type { StatusFilter, ProductRow } from './types';
import {
  DownloadOutlined,
  DownOutlined,
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Input, Select, Table, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import { Card } from '@/components/common/Card';
import { PageBreadcrumb } from '@/components/common/breadcrumb';
import {
  DEFAULT_TABLE_PAGE_SIZE,
  DEFAULT_TABLE_PAGE_SIZE_OPTIONS,
} from '@/constants/pagination';
import { productMocks } from '@/mocks/ecommerce/products';
import { formatPrice, formatPriceRange, formatKeyValuePairs } from '@/utils/format';
import { getProductStatusClass, getStockStatusClass } from '@/utils/statusClasses';

const renderHeaderTitle = (label: string) => (
  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
);

export function ProductsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_TABLE_PAGE_SIZE);
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly number[]>([]);
  const [sortField, setSortField] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | undefined>();

  const filteredProducts = useMemo(() => {
    return productMocks.filter((product) => {
      const matchSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || product.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const sortedProducts = useMemo(() => {
    const products = filteredProducts.map((product): ProductRow => {
      const prices = product.skus.map((sku) => sku.price);
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
      const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
      const totalStock = product.skus.reduce((sum, sku) => sum + sku.stock, 0);
      return { ...product, key: product.id, minPrice, maxPrice, totalStock };
    });
    if (!sortField || !sortOrder) return products;
    return [...products].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'status':
          comparison = (a.status ?? '').localeCompare(b.status ?? '');
          break;
        case 'skuCount':
          comparison = a.skus.length - b.skus.length;
          break;
        case 'totalStock':
          comparison = a.totalStock - b.totalStock;
          break;
        case 'minPrice':
          comparison = a.minPrice - b.minPrice;
          break;
        default:
          return 0;
      }
      return sortOrder === 'ascend' ? comparison : -comparison;
    });
  }, [filteredProducts, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  const paginatedProducts = sortedProducts
    .slice((safePage - 1) * pageSize, safePage * pageSize);

  const showingFrom = sortedProducts.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const showingTo = Math.min(safePage * pageSize, sortedProducts.length);

  const handleTableChange = (_pagination: unknown, _filters: unknown, sorter: SorterResult<ProductRow> | SorterResult<ProductRow>[]) => {
    const result = Array.isArray(sorter) ? sorter[0] : sorter;
    setSortField(result.columnKey as string | undefined);
    setSortOrder(result.order === null ? undefined : result.order);
    setPage(1);
  };

  const columns: TableColumnsType<ProductRow> = useMemo(
    () => [
    {
      title: renderHeaderTitle('Product'),
      dataIndex: 'name',
      key: 'name',
      width: 200,
      sorter: true,
      sortOrder: sortField === 'name' ? sortOrder : undefined,
      showSorterTooltip: false,
      render: (name: string) => (
        <span className="font-normal text-gray-800 dark:text-white/90">{name}</span>
      ),
    },
    {
      title: renderHeaderTitle('Status'),
      dataIndex: 'status',
      key: 'status',
      width: 150,
      sorter: true,
      sortOrder: sortField === 'status' ? sortOrder : undefined,
      showSorterTooltip: false,
      render: (status: ProductStatus) => (
        <Tag bordered={false} className={getProductStatusClass(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: renderHeaderTitle('SKUs'),
      key: 'skuCount',
      width: 100,
      align: 'right',
      sorter: true,
      sortOrder: sortField === 'skuCount' ? sortOrder : undefined,
      showSorterTooltip: false,
      render: (_value, record) => record.skus.length,
    },
    {
      title: renderHeaderTitle('Total Stock'),
      dataIndex: 'totalStock',
      key: 'totalStock',
      width: 140,
      align: 'right',
      sorter: true,
      sortOrder: sortField === 'totalStock' ? sortOrder : undefined,
      showSorterTooltip: false,
    },
    {
      title: renderHeaderTitle('Price Range'),
      key: 'minPrice',
      width: 180,
      align: 'right',
      sorter: true,
      sortOrder: sortField === 'minPrice' ? sortOrder : undefined,
      showSorterTooltip: false,
      render: (_value, record) => (
        <span className="font-medium text-gray-800 dark:text-white/90">
          {formatPriceRange(record.minPrice, record.maxPrice)}
        </span>
      ),
    },
  ],
  [sortField, sortOrder]
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <PageBreadcrumb pageTitle="Products" />

      <Card
        title="Products"
        description="Track your store's progress to boost your sales."
        className="flex min-h-0 flex-1 flex-col"
        headerClassName="shrink-0 items-center pb-4"
        bodyClassName="flex min-h-0 flex-1 flex-col overflow-hidden"
        disableBodyPadding
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="default"
              size="large"
              icon={<DownloadOutlined />}
              className="!inline-flex !items-center !gap-2 !rounded-lg !border-gray-300 !bg-white !px-4 !text-sm !font-medium !text-gray-700 hover:!border-gray-400 hover:!bg-gray-50 dark:!border-gray-700 dark:!bg-gray-800 dark:!text-gray-300"
            >
              Export
            </Button>
            <Button
              type="default"
              size="large"
              icon={<PlusOutlined />}
              className="!inline-flex !items-center !gap-2 !rounded-lg !border-brand-500 !bg-brand-500 !px-4 !text-sm !font-medium !text-white hover:!border-brand-600 hover:!bg-brand-600"
            >
              Add Product
            </Button>
          </div>
        }
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-body dark:text-bodydark2">
              Showing {showingFrom}-{showingTo} of {sortedProducts.length}
            </p>
            <div className="flex items-center gap-2">
              <Select<number>
                value={pageSize}
                size="large"
                onChange={(value) => {
                  setPageSize(value);
                  setPage(1);
                }}
                className="w-24"
                options={DEFAULT_TABLE_PAGE_SIZE_OPTIONS.map((value) => ({
                  value,
                  label: `${value}`,
                }))}
              />
              <Button
                size="large"
                aria-label="Previous page"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={safePage === 1}
                className="!h-10 !w-10 !rounded-lg"
                icon={<LeftOutlined />}
              >
              </Button>
              {pageNumbers.map((number) => (
                <Button
                  key={number}
                  size="large"
                  type="default"
                  className={`!h-10 !w-10 !rounded-lg ${
                    safePage === number
                      ? '!border-brand-500 !bg-brand-500 !text-white hover:!border-brand-600 hover:!bg-brand-600'
                      : '!border-gray-300 !bg-white !text-gray-700 hover:!border-gray-400 dark:!border-gray-700 dark:!bg-gray-800 dark:!text-gray-200'
                  }`}
                  onClick={() => setPage(number)}
                >
                  {number}
                </Button>
              ))}
              <Button
                size="large"
                aria-label="Next page"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={safePage === totalPages}
                className="!h-10 !w-10 !rounded-lg"
                icon={<RightOutlined />}
              >
              </Button>
            </div>
          </div>
        }
      >
        <div className="flex shrink-0 flex-col gap-3 border-b border-gray-200 px-6 py-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:w-64">
            <Input
              allowClear
              size="large"
              placeholder="Search..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              prefix={<SearchOutlined className="text-gray-400 dark:text-white/30" />}
              className="products-search-input w-full"
            />
          </div>
          <Select<StatusFilter>
            value={statusFilter}
            size="large"
            onChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
            className="w-full sm:w-36"
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'Active', label: 'Active' },
              { value: 'Draft', label: 'Draft' },
              { value: 'Inactive', label: 'Inactive' },
            ]}
          />
        </div>
        <div className="min-h-0 flex-1 overflow-auto">
          <Table<ProductRow>
          tableLayout="fixed"
          columns={columns}
          dataSource={paginatedProducts}
          onChange={handleTableChange}
          sortDirections={['ascend', 'descend']}
          pagination={false}
          size="middle"
          rowClassName={() => 'cursor-pointer'}
          locale={{ emptyText: 'No products match the current filters.' }}
          expandable={{
            showExpandColumn: true,
            columnWidth: 44,
            expandedRowKeys,
            onExpandedRowsChange: (keys) => setExpandedRowKeys(keys as number[]),
            expandRowByClick: true,
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <DownOutlined
                  className="text-[12px] text-gray-500"
                  onClick={(event) => onExpand(record, event)}
                />
              ) : (
                <RightOutlined
                  className="text-[12px] text-gray-500"
                  onClick={(event) => onExpand(record, event)}
                />
              ),
            expandedRowRender: (record) => (
              <Table<SKU & { key: number }>
                tableLayout="fixed"
                className="[&_.ant-table-tbody>tr>td.ant-table-cell:nth-child(2)]:!pl-8"
                size="middle"
                pagination={false}
                showHeader={false}
                rowClassName={() => 'bg-gray-50 dark:bg-white/[0.02]'}
                rowKey="id"
                dataSource={record.skus.map((sku) => ({ ...sku, key: sku.id }))}
                columns={[
                  {
                    title: '',
                    key: 'spacer',
                    width: 20,
                    render: () => null,
                  },
                  {
                    title: 'Product',
                    key: 'product',
                    width: 200,
                    render: (_value, sku) => (
                      <span className="whitespace-nowrap text-body dark:text-bodydark2">
                        {sku.id}
                        {sku.attributes && Object.keys(sku.attributes).length > 0
                          ? ` — ${formatKeyValuePairs(sku.attributes)}`
                          : ''}
                      </span>
                    ),
                  },
                  {
                    title: 'Status',
                    key: 'stockTag',
                    width: 150,
                    render: (_value, sku) => (
                      <Tag bordered={false} className={getStockStatusClass(sku.stock)}>
                        {sku.stock === 0 ? 'Out of Stock' : sku.stock < 10 ? 'Low Stock' : 'In Stock'}
                      </Tag>
                    ),
                  },
                  {
                    title: 'SKUs',
                    key: 'skusPlaceholder',
                    width: 100,
                    align: 'right',
                    render: () => null,
                  },
                  {
                    title: 'Total Stock',
                    dataIndex: 'stock',
                    key: 'stock',
                    width: 140,
                    align: 'right',
                  },
                  {
                    title: 'Price Range',
                    key: 'price',
                    width: 180,
                    align: 'right',
                    render: (_value, sku) => (
                      <span className="font-medium text-gray-800 dark:text-white/90">
                        {formatPrice(sku.price)}
                      </span>
                    ),
                  },
                ]}
              />
            ),
          }}
        />
        </div>
      </Card>
    </div>
  );
}
