import { useEffect, useMemo, useState } from 'react';
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
import Card from '@/components/common/Card';
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

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/af3fa1af-28f7-415e-b642-9e674043e7e5', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        runId: 'pre-fix',
        hypothesisId: 'H4',
        location: 'ProductsPage.tsx:72',
        message: 'ProductsPage rendered at runtime',
        data: { defaultPageSize: DEFAULT_TABLE_PAGE_SIZE, selectedPageSize: pageSize },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, [pageSize]);

  const filteredProducts = useMemo(() => {
    return productMocks.filter((product) => {
      const matchSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || product.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  const paginatedProducts = filteredProducts
    .slice((safePage - 1) * pageSize, safePage * pageSize)
    .map((product): ProductRow => {
      const prices = product.skus.map((sku) => sku.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const totalStock = product.skus.reduce((sum, sku) => sum + sku.stock, 0);

      return {
        ...product,
        key: product.id,
        minPrice,
        maxPrice,
        totalStock,
      };
    });

  const showingFrom = filteredProducts.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const showingTo = Math.min(safePage * pageSize, filteredProducts.length);

  const columns: TableColumnsType<ProductRow> = [
    {
      title: renderHeaderTitle('Product'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <span className="font-normal text-gray-800 dark:text-white/90">{name}</span>
      ),
    },
    {
      title: renderHeaderTitle('Status'),
      dataIndex: 'status',
      key: 'status',
      width: 150,
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
      render: (_value, record) => record.skus.length,
    },
    {
      title: renderHeaderTitle('Total Stock'),
      dataIndex: 'totalStock',
      key: 'totalStock',
      width: 140,
      align: 'right',
    },
    {
      title: renderHeaderTitle('Price Range'),
      key: 'priceRange',
      width: 180,
      align: 'right',
      render: (_value, record) => (
        <span className="font-medium text-gray-800 dark:text-white/90">
          {formatPriceRange(record.minPrice, record.maxPrice)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">Products</h1>
      </div>

      <Card
        title="Products"
        description="Track your store's progress to boost your sales."
        headerClassName="items-center pb-4"
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
              Showing {showingFrom}-{showingTo} of {filteredProducts.length}
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
        <div className="flex flex-col gap-3 border-b border-gray-200 px-6 py-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
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
        <Table<ProductRow>
          columns={columns}
          dataSource={paginatedProducts}
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
                className="[&_.ant-table-tbody>tr>td.ant-table-cell:nth-child(2)]:!pl-8"
                size="small"
                pagination={false}
                showHeader={false}
                rowClassName={() => 'bg-gray-50 dark:bg-white/[0.02]'}
                rowKey="id"
                dataSource={record.skus.map((sku) => ({ ...sku, key: sku.id }))}
                columns={[
                  {
                    title: '',
                    key: 'spacer',
                    width: 44,
                    render: () => null,
                  },
                  {
                    title: 'SKU',
                    dataIndex: 'id',
                    key: 'id',
                    width: 140,
                    render: (id: number) => (
                      <span className="text-body dark:text-bodydark2">SKU #{id}</span>
                    ),
                  },
                  {
                    title: 'Attributes',
                    key: 'attributes',
                    render: (_value, sku) => (
                      <span className="text-body dark:text-bodydark2">
                        {formatKeyValuePairs(sku.attributes)}
                      </span>
                    ),
                  },
                  {
                    title: 'Stock',
                    key: 'stockTag',
                    width: 140,
                    render: (_value, sku) => (
                      <Tag bordered={false} className={getStockStatusClass(sku.stock)}>
                        {sku.stock === 0 ? 'Out of Stock' : sku.stock < 10 ? 'Low Stock' : 'In Stock'}
                      </Tag>
                    ),
                  },
                  {
                    title: 'Qty',
                    dataIndex: 'stock',
                    key: 'stock',
                    width: 90,
                    align: 'right',
                  },
                  {
                    title: 'Price',
                    key: 'price',
                    width: 140,
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
      </Card>
    </div>
  );
}
