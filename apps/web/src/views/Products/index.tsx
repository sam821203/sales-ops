import type { SorterResult } from 'antd/es/table/interface';
import { useCallback, useMemo, useState } from 'react';
import type { SKU, ProductStatus, AttributeDefinition } from '@salesops/shared';
import type { StatusFilter, ProductRow } from './types';
import {
  DeleteOutlined,
  DownloadOutlined,
  DownOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  FilterOutlined,
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Button, Dropdown, Form, Input, InputNumber, message, Modal, Select, Space, Table, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import { Card } from '@/components/common/Card/index.ts';
import { PageBreadcrumb } from '@/components/common/breadcrumb';
import {
  DEFAULT_TABLE_PAGE_SIZE,
  DEFAULT_TABLE_PAGE_SIZE_OPTIONS,
} from '@/constants/pagination';
import { productMocks, categoryMocks, brandMocks } from '@/mocks/ecommerce/products';
import { formatPrice, formatPriceRange, formatKeyValuePairs } from '@/utils/format';
import { getProductStatusClass, getStockStatusClass } from '@/utils/statusClasses';

const renderHeaderTitle = (label: string) => (
  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">{label}</span>
);

const formatSkuId = (id: number) => `SKU${String(id).padStart(3, '0')}`;

function getAttributesFromForm(
  raw: Record<string, string>,
  definitions: AttributeDefinition[]
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const def of definitions) {
    const value = raw[def.key]?.trim() ?? '';
    if (!value) continue;
    if (def.type === 'enum') {
      if (def.options.includes(value)) result[def.key] = value;
    } else {
      result[def.key] = value;
    }
  }
  return result;
}

export function ProductsPage() {
  const [products, setProducts] = useState(() => productMocks);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [pendingCategoryFilter, setPendingCategoryFilter] = useState('');
  const [pendingBrandFilter, setPendingBrandFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_TABLE_PAGE_SIZE);
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly number[]>([]);
  const [sortField, setSortField] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | undefined>();
  const [addSkuModalOpen, setAddSkuModalOpen] = useState(false);
  const [addSkuProductId, setAddSkuProductId] = useState<number | null>(null);
  const [addSkuForm] = Form.useForm<{
    price: number;
    stock: number;
    attributes: Record<string, string> | { key: string; value: string }[];
  }>();

  const filteredProducts = useMemo(() => {
    const categoryFilterLower = categoryFilter.trim().toLowerCase();
    const brandFilterLower = brandFilter.trim().toLowerCase();
    return products.filter((product) => {
      const matchSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || product.status === statusFilter;
      const categoryName = product.categoryId != null ? categoryMocks.find((c) => c.id === product.categoryId)?.name ?? '' : '';
      const brandName = product.brandId != null ? brandMocks.find((b) => b.id === product.brandId)?.name ?? '' : '';
      const matchCategory = !categoryFilterLower || categoryName.toLowerCase().includes(categoryFilterLower);
      const matchBrand = !brandFilterLower || brandName.toLowerCase().includes(brandFilterLower);
      return matchSearch && matchStatus && matchCategory && matchBrand;
    });
  }, [products, search, statusFilter, categoryFilter, brandFilter]);

  const nextSkuId = useMemo(() => {
    const maxId = products.reduce(
      (max, p) => Math.max(max, ...p.skus.map((s) => s.id)),
      0
    );
    return maxId + 1;
  }, [products]);

  const addSkuToProduct = (productId: number, newSku: Omit<SKU, 'id'>) => {
    const id = nextSkuId;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, skus: [...p.skus, { ...newSku, id, productId }] }
          : p
      )
    );
    message.success('SKU added.');
  };

  const removeProduct = useCallback((productId: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    message.success('Product removed.');
  }, []);

  const removeSku = useCallback((productId: number, skuId: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, skus: p.skus.filter((s) => s.id !== skuId) }
          : p
      )
    );
    message.success('SKU removed.');
  }, []);

  const openAddSkuModal = useCallback(
    (productId: number) => {
      setAddSkuProductId(productId);
      addSkuForm.resetFields();
      const product = products.find((p) => p.id === productId);
      if (product?.attributeDefinitions?.length) {
        addSkuForm.setFieldsValue({
          attributes: Object.fromEntries(product.attributeDefinitions.map((d) => [d.key, ''])),
        });
      } else {
        addSkuForm.setFieldsValue({ attributes: [] });
      }
      setAddSkuModalOpen(true);
    },
    [addSkuForm, products]
  );

  const closeAddSkuModal = () => {
    setAddSkuModalOpen(false);
    setAddSkuProductId(null);
    addSkuForm.resetFields();
  };

  const submitAddSku = () => {
    if (addSkuProductId == null) return;
    const product = products.find((p) => p.id === addSkuProductId);
    addSkuForm.validateFields().then((values) => {
      const attrsRaw = values.attributes;
      const attributes: Record<string, string> =
        product?.attributeDefinitions?.length && attrsRaw != null && !Array.isArray(attrsRaw)
          ? getAttributesFromForm(attrsRaw as Record<string, string>, product.attributeDefinitions)
          : (Array.isArray(attrsRaw) ? attrsRaw : []).reduce<Record<string, string>>(
              (acc, item: { key?: string; value?: string }) => {
                if (item?.key?.trim()) acc[item.key.trim()] = item?.value?.trim() ?? '';
                return acc;
              },
              {}
            );
      addSkuToProduct(addSkuProductId, {
        productId: addSkuProductId,
        price: values.price,
        stock: values.stock,
        attributes,
      });
      closeAddSkuModal();
    });
  };

  const sortedProducts = useMemo(() => {
    const getCategoryName = (id: number | undefined) =>
      categoryMocks.find((c) => c.id === id)?.name ?? '—';
    const getBrandName = (id: number | undefined) =>
      brandMocks.find((b) => b.id === id)?.name ?? '—';
    const products = filteredProducts.map((product): ProductRow => {
      const prices = product.skus.map((sku) => sku.price);
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
      const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
      const totalStock = product.skus.reduce((sum, sku) => sum + sku.stock, 0);
      return {
        ...product,
        key: product.id,
        minPrice,
        maxPrice,
        totalStock,
        categoryName: getCategoryName(product.categoryId),
        brandName: getBrandName(product.brandId),
      };
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
        case 'category':
          comparison = (a.categoryName ?? '').localeCompare(b.categoryName ?? '');
          break;
        case 'brand':
          comparison = (a.brandName ?? '').localeCompare(b.brandName ?? '');
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
      width: 260,
      sorter: true,
      sortOrder: sortField === 'name' ? sortOrder : undefined,
      showSorterTooltip: false,
      render: (name: string, record: ProductRow) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={record.imageUrl}
            shape="square"
            size={40}
            className="shrink-0"
          >
            {name?.charAt(0) ?? '?'}
          </Avatar>
          <span className="font-normal text-gray-800 dark:text-white/90">{name}</span>
        </div>
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
      title: renderHeaderTitle('Category'),
      dataIndex: 'categoryName',
      key: 'category',
      width: 120,
      sorter: true,
      sortOrder: sortField === 'category' ? sortOrder : undefined,
      showSorterTooltip: false,
      render: (_value: string, record: ProductRow) => (
        <span className="text-gray-800 dark:text-white/90">{record.categoryName ?? '—'}</span>
      ),
    },
    {
      title: renderHeaderTitle('Brand'),
      dataIndex: 'brandName',
      key: 'brand',
      width: 120,
      sorter: true,
      sortOrder: sortField === 'brand' ? sortOrder : undefined,
      showSorterTooltip: false,
      render: (_value: string, record: ProductRow) => (
        <span className="text-gray-800 dark:text-white/90">{record.brandName ?? '—'}</span>
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
        <span className="text-gray-800 dark:text-white/90">
          {formatPriceRange(record.minPrice, record.maxPrice)}
        </span>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 56,
      align: 'right',
      fixed: 'right',
      render: (_value, record) => {
        const menuItems: MenuProps['items'] = [
          {
            key: 'add-sku',
            icon: <PlusOutlined />,
            label: 'Add SKU',
            onClick: () => openAddSkuModal(record.id),
          },
          {
            key: 'view',
            icon: <EyeOutlined className="!text-blue-600" />,
            label: 'View',
            onClick: () => message.info(`View product ${record.id}`),
          },
          {
            key: 'edit',
            icon: <EditOutlined className="!text-amber-600" />,
            label: 'Edit',
            onClick: () => message.info(`Edit product ${record.id}`),
          },
          {
            type: 'divider',
          },
          {
            key: 'delete',
            icon: <DeleteOutlined className="!text-red-600" />,
            label: 'Delete',
            danger: true,
            onClick: () => {
              Modal.confirm({
                title: 'Remove product?',
                content: 'This product and its SKUs will be removed.',
                okText: 'Remove',
                okType: 'danger',
                cancelText: 'Cancel',
                onOk: () => removeProduct(record.id),
              });
            },
          },
        ];
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
              <button
                type="button"
                className="inline-flex items-center justify-center p-0 min-w-0 h-auto border-0 bg-transparent cursor-pointer text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                aria-label="Actions"
              >
                <EllipsisOutlined className="align-middle leading-none" style={{ fontSize: '1.5rem' }} />
              </button>
            </Dropdown>
          </div>
        );
      },
    },
  ],
  [sortField, sortOrder, openAddSkuModal, removeProduct]
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
          <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
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
            <Dropdown
            trigger={['click']}
            open={filterDropdownOpen}
            onOpenChange={(open) => {
              setFilterDropdownOpen(open);
              if (open) {
                setPendingCategoryFilter(categoryFilter);
                setPendingBrandFilter(brandFilter);
              }
            }}
            dropdownRender={() => (
              <div className="min-w-[220px] rounded-2xl border border-gray-200 bg-white p-4 shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)] dark:border-gray-800 dark:bg-gray-800">
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Category
                    </label>
                    <Input
                      value={pendingCategoryFilter}
                      onChange={(e) => setPendingCategoryFilter(e.target.value)}
                      placeholder="All Categories"
                      size="large"
                      className="w-full"
                      allowClear
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Brand
                    </label>
                    <Input
                      value={pendingBrandFilter}
                      onChange={(e) => setPendingBrandFilter(e.target.value)}
                      placeholder="All Brands"
                      size="large"
                      className="w-full"
                      allowClear
                    />
                  </div>
                </div>
                <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                  <Button
                    type="primary"
                    size="middle"
                    onClick={() => {
                      setCategoryFilter(pendingCategoryFilter);
                      setBrandFilter(pendingBrandFilter);
                      setPage(1);
                      setFilterDropdownOpen(false);
                    }}
                    className="!h-11 !w-full !rounded-lg !border-0 !bg-brand-500 !px-5 !py-3.5 !text-sm !font-medium !text-white !shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:!bg-brand-600"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            )}
          >
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            >
              <FilterOutlined className="text-base" />
              Filter
            </button>
          </Dropdown>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-auto">
          <Table<ProductRow>
          tableLayout="fixed"
          columns={columns}
          dataSource={paginatedProducts}
          onChange={handleTableChange}
          sortDirections={['ascend', 'descend']}
          pagination={false}
          size="large"
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
                className="[&_.ant-table-thead>tr>th.ant-table-cell:first-child]:!w-5 [&_.ant-table-tbody>tr>td.ant-table-cell:nth-child(2)]:!pl-8"
                size="large"
                pagination={false}
                showHeader
                scroll={{ x: 900 }}
                rowClassName={() => ''}
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
                    title: renderHeaderTitle('SKU ID'),
                    dataIndex: 'id',
                    key: 'id',
                    width: 100,
                    render: (id: number) => (
                      <span className="whitespace-nowrap text-gray-800 dark:text-white/90">
                        {formatSkuId(id)}
                      </span>
                    ),
                  },
                  {
                    title: renderHeaderTitle('Attributes'),
                    key: 'attributes',
                    width: 200,
                    render: (_value, sku) => (
                      <span className="whitespace-nowrap text-body dark:text-bodydark2">
                        {sku.attributes && Object.keys(sku.attributes).length > 0
                          ? formatKeyValuePairs(sku.attributes)
                          : '—'}
                      </span>
                    ),
                  },
                  {
                    title: renderHeaderTitle('Status'),
                    key: 'stockTag',
                    width: 120,
                    render: (_value, sku) => (
                      <Tag bordered={false} className={getStockStatusClass(sku.stock)}>
                        {sku.stock === 0 ? 'Out of Stock' : sku.stock < 10 ? 'Low Stock' : 'In Stock'}
                      </Tag>
                    ),
                  },
                  {
                    title: renderHeaderTitle('Stock'),
                    dataIndex: 'stock',
                    key: 'stock',
                    width: 100,
                    align: 'right',
                  },
                  {
                    title: renderHeaderTitle('Price'),
                    key: 'price',
                    width: 120,
                    align: 'right',
                    render: (_value, sku) => (
                      <span className="text-gray-800 dark:text-white/90">
                        {formatPrice(sku.price)}
                      </span>
                    ),
                  },
                  {
                    title: '',
                    key: 'actions',
                    width: 56,
                    align: 'right',
                    fixed: 'right',
                    render: (_value, sku) => {
                      const menuItems: MenuProps['items'] = [
                        {
                          key: 'view',
                          icon: <EyeOutlined className="!text-blue-600" />,
                          label: 'View',
                          onClick: () =>
                            message.info(`View ${formatSkuId(sku.id)} (product ${record.id})`),
                        },
                        {
                          key: 'edit',
                          icon: <EditOutlined className="!text-amber-600" />,
                          label: 'Edit',
                          onClick: () =>
                            message.info(`Edit ${formatSkuId(sku.id)} (product ${record.id})`),
                        },
                        {
                          type: 'divider',
                        },
                        {
                          key: 'delete',
                          icon: <DeleteOutlined className="!text-red-600" />,
                          label: 'Delete',
                          danger: true,
                          onClick: () => {
                            Modal.confirm({
                              title: `Remove ${formatSkuId(sku.id)}?`,
                              content: 'This SKU will be removed.',
                              okText: 'Remove',
                              okType: 'danger',
                              cancelText: 'Cancel',
                              onOk: () => removeSku(record.id, sku.id),
                            });
                          },
                        },
                      ];
                      return (
                        <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
                          <button
                            type="button"
                            className="inline-flex items-center justify-center p-0 min-w-0 h-auto border-0 bg-transparent cursor-pointer text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            aria-label="Actions"
                          >
                            <EllipsisOutlined className="align-middle leading-none" style={{ fontSize: '1.5rem' }} />
                          </button>
                        </Dropdown>
                      );
                    },
                  },
                ]}
              />
            ),
          }}
        />
        </div>
      </Card>

      <Modal
        title="Add SKU"
        open={addSkuModalOpen}
        onCancel={closeAddSkuModal}
        onOk={submitAddSku}
        okText="Add"
        destroyOnClose
      >
        <Form form={addSkuForm} layout="vertical" className="mt-4">
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Required' }]}
          >
            <InputNumber min={0} step={0.01} className="w-full" />
          </Form.Item>
          <Form.Item
            name="stock"
            label="Stock"
            rules={[{ required: true, message: 'Required' }]}
          >
            <InputNumber min={0} precision={0} className="w-full" />
          </Form.Item>
          {addSkuProductId != null && (() => {
            const product = products.find((p) => p.id === addSkuProductId);
            const defs = product?.attributeDefinitions;
            if (defs?.length) {
              return defs.map((def) => (
                <Form.Item
                  key={def.key}
                  name={['attributes', def.key]}
                  label={def.label}
                  rules={
                    def.type === 'enum' && def.options.length
                      ? [
                          {
                            validator: (_: unknown, value: string) =>
                              !value?.trim() || def.options.includes(value?.trim())
                                ? Promise.resolve()
                                : Promise.reject(new Error(`Must be one of: ${def.options.join(', ')}`)),
                          },
                        ]
                      : undefined
                  }
                >
                  {def.type === 'enum' ? (
                    <Select
                      allowClear
                      placeholder={`Select ${def.label}`}
                      options={def.options.map((opt) => ({ value: opt, label: opt }))}
                    />
                  ) : (
                    <Input placeholder={def.label} allowClear />
                  )}
                </Form.Item>
              ));
            }
            return (
              <Form.Item label="Attributes" name="attributes">
                <Form.List name="attributes">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...rest }) => (
                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                          <Form.Item {...rest} name={[name, 'key']} rules={[{ required: false }]}>
                            <Input placeholder="Key" />
                          </Form.Item>
                          <Form.Item {...rest} name={[name, 'value']} rules={[{ required: false }]}>
                            <Input placeholder="Value" />
                          </Form.Item>
                          <Button type="text" onClick={() => remove(name)}>
                            Remove
                          </Button>
                        </Space>
                      ))}
                      <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          Add attribute
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Form.Item>
            );
          })()}
        </Form>
      </Modal>
    </div>
  );
}
