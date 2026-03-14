import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowDownOutlined, ArrowUpOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, message, Modal, Select, Spin, Table, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import { Card } from '@/components/common/Card';
import { PageBreadcrumb } from '@/components/common/breadcrumb';
import {
  createInventoryAdjustment,
  getInventoryAdjustmentById,
  getInventoryAdjustmentsList,
  inventoryAdjustmentKeys,
} from '@/api/inventoryAdjustments';
import type {
  InventoryAdjustmentItem,
  InventoryAdjustmentsListResponse,
} from '@/api/types';
import { getProductById, getProducts, productKeys } from '@/api/products';
import { DEFAULT_TABLE_PAGE_SIZE, DEFAULT_TABLE_PAGE_SIZE_OPTIONS } from '@/constants/pagination';
import { formatKeyValuePairs } from '@/utils/format';
import { inventoryAdjustmentTypeValues } from '@salesops/shared';

function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function InventoryAdjustmentPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_TABLE_PAGE_SIZE);
  const [q, setQ] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<InventoryAdjustmentItem | null>(null);

  const [addSkuId, setAddSkuId] = useState<number | undefined>(undefined);
  const [addProductSearch, setAddProductSearch] = useState('');
  const [addProductSearchDebounced, setAddProductSearchDebounced] = useState('');
  const addProductSearchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [addForm] = Form.useForm<{
    productId: number;
    adjustmentType: 'Increase' | 'Decrease';
    quantity: number;
    reason: string;
    adjustedBy: number;
  }>();

  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  const listParams = useMemo(
    () => ({ page, pageSize, q: q.trim() || undefined }),
    [page, pageSize, q]
  );

  const {
    data: listResponse,
    isLoading: listLoading,
    isError: listError,
    error: listErrorDetail,
  } = useQuery<InventoryAdjustmentsListResponse>({
    queryKey: inventoryAdjustmentKeys.list(listParams),
    queryFn: () => getInventoryAdjustmentsList(listParams),
  });

  const { data: detailRecord, isLoading: detailLoading } = useQuery({
    queryKey: inventoryAdjustmentKeys.detail(detailId ?? 0),
    queryFn: () => getInventoryAdjustmentById(detailId!),
    enabled: detailId != null && detailId > 0,
  });

  useEffect(() => {
    if (!addModalOpen) {
      setAddProductSearch('');
      setAddProductSearchDebounced('');
      if (addProductSearchDebounceRef.current != null) {
        clearTimeout(addProductSearchDebounceRef.current);
        addProductSearchDebounceRef.current = null;
      }
      return;
    }
    addProductSearchDebounceRef.current = setTimeout(() => {
      setAddProductSearchDebounced(addProductSearch);
    }, 300);
    return () => {
      if (addProductSearchDebounceRef.current != null) {
        clearTimeout(addProductSearchDebounceRef.current);
        addProductSearchDebounceRef.current = null;
      }
    };
  }, [addModalOpen, addProductSearch]);

  const { data: productsResponse, isFetching: productsFetching } = useQuery({
    queryKey: productKeys.list({
      page: 1,
      pageSize: 50,
      q: addProductSearchDebounced.trim() || undefined,
    }),
    queryFn: () =>
      getProducts({
        page: 1,
        pageSize: 50,
        q: addProductSearchDebounced.trim() || undefined,
      }),
    enabled: addModalOpen,
  });

  const selectedProductId = Form.useWatch('productId', addForm);

  const { data: selectedProduct } = useQuery({
    queryKey: productKeys.detail(selectedProductId ?? 0),
    queryFn: () => getProductById(selectedProductId!),
    enabled: addModalOpen && selectedProductId != null && selectedProductId > 0,
  });

  const createMutation = useMutation({
    mutationFn: (body: Parameters<typeof createInventoryAdjustment>[0]) =>
      createInventoryAdjustment(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryAdjustmentKeys.all });
      setAddModalOpen(false);
      setAddSkuId(undefined);
      addForm.resetFields();
      message.success('Inventory adjustment created.');
    },
    onError: (e: Error) =>
      message.error(e.message || 'Failed to create inventory adjustment'),
  });

  const items: InventoryAdjustmentItem[] = listResponse?.items ?? [];
  const total = listResponse?.total ?? 0;

  const openDetail = (record: InventoryAdjustmentItem) => {
    setDetailItem(record);
    setDetailId(record.id);
    setDetailModalOpen(true);
  };

  const closeDetail = () => {
    setDetailModalOpen(false);
    setDetailId(null);
    setDetailItem(null);
  };

  const handleAddSubmit = () => {
    if (addSkuId == null) {
      message.error('Please select a SKU');
      return;
    }
    addForm
      .validateFields()
      .then((values) => {
        createMutation.mutate({
          skuId: addSkuId,
          adjustmentType: values.adjustmentType,
          quantity: values.quantity,
          reason: values.reason,
          adjustedBy: values.adjustedBy,
        });
      })
      .catch(() => {});
  };

  const productOptions = useMemo(() => {
    const list = productsResponse?.items ?? [];
    const options = list.map((product: { id: number; name: string }) => ({
      label: `${product.name} (P${product.id})`,
      value: product.id,
    }));
    if (
      selectedProduct &&
      !list.some((product: { id: number }) => product.id === selectedProduct.id)
    ) {
      options.unshift({
        label: `${selectedProduct.name} (P${selectedProduct.id})`,
        value: selectedProduct.id,
      });
    }
    return options;
  }, [productsResponse?.items, selectedProduct]);

  const skuOptions = useMemo(() => {
    const skus = selectedProduct?.skus ?? [];
    const options = skus.map(
      (sku: { id: number; stock: number; attributes?: Record<string, string> }) => ({
        label: `SKU #${sku.id}${
          Object.keys(sku.attributes ?? {}).length > 0
            ? ` (${formatKeyValuePairs(sku.attributes ?? {})})`
            : ''
        } – Stock: ${sku.stock}`,
        value: sku.id,
      })
    );
    return options;
  }, [selectedProduct?.skus]);

  const columns: TableColumnsType<InventoryAdjustmentItem> = useMemo(
    () => [
      {
        title: 'Product',
        key: 'product',
        render: (_: unknown, record: InventoryAdjustmentItem) => (
          <div>
            <span className="font-medium">{record.productName}</span>
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 font-mono">
              P{record.productId}
            </span>
          </div>
        ),
      },
      {
        title: 'SKU',
        key: 'sku',
        render: (_: unknown, record: InventoryAdjustmentItem) => (
          <div className="text-sm">
            <span className="font-mono text-gray-600 dark:text-gray-300">
              #{record.skuId}
            </span>
            {Object.keys(record.skuAttributes ?? {}).length > 0 && (
              <span className="ml-1 text-gray-500 dark:text-gray-400">
                ({formatKeyValuePairs(record.skuAttributes ?? {})})
              </span>
            )}
          </div>
        ),
      },
      {
        title: 'Type',
        dataIndex: 'adjustmentType',
        key: 'adjustmentType',
        render: (type: string) => (
          <Tag
            color={type === 'Increase' ? 'green' : 'red'}
            className="flex items-center gap-1 w-fit"
          >
            {type === 'Increase' ? (
              <ArrowUpOutlined />
            ) : (
              <ArrowDownOutlined />
            )}
            {type}
          </Tag>
        ),
      },
      {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
        align: 'right',
      },
      {
        title: 'Reason',
        dataIndex: 'reason',
        key: 'reason',
        ellipsis: true,
      },
      {
        title: 'Adjusted By',
        dataIndex: 'adjustedBy',
        key: 'adjustedBy',
        render: (val: number) => <span className="text-sm">User #{val}</span>,
      },
      {
        title: 'Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (val: Date | string) => (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatDateTime(val)}
          </span>
        ),
      },
      {
        title: '',
        key: 'actions',
        width: 64,
        render: (_: unknown, record: InventoryAdjustmentItem) => (
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => openDetail(record)}
            aria-label="View details"
          />
        ),
      },
    ],
    []
  );

  const displayDetail: InventoryAdjustmentItem | null =
    (detailRecord ?? detailItem) ?? null;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <PageBreadcrumb pageTitle="Inventory Adjustment" />
      <Card
        title="Inventory Adjustment"
        description="Adjust stock levels for your products."
        className="flex min-h-0 flex-1 flex-col"
        bodyClassName="flex min-h-0 flex-1 flex-col overflow-hidden"
        disableBodyPadding
      >
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <div className="w-full min-w-0 sm:max-w-[320px]">
            <Input.Search
              allowClear
              size="large"
              placeholder="Search by product or SKU ID..."
              value={searchInput}
              onChange={(e: { target: { value: string } }) => {
                const v = e.target.value;
                setSearchInput(v);
                if (v === '') {
                  setQ('');
                  setPage(1);
                }
              }}
              onSearch={(value: string) => {
                setQ((value ?? '').trim());
                setPage(1);
              }}
              enterButton={
                <span className="inline-flex items-center">
                  <SearchOutlined />
                </span>
              }
            />
          </div>
          <Button
            type="default"
            size="large"
            icon={<PlusOutlined />}
            className="!inline-flex !shrink-0 !items-center !gap-2 !rounded-lg !border-brand-500 !bg-brand-500 !px-4 !text-sm !font-medium !text-white hover:!border-brand-600 hover:!bg-brand-600"
            onClick={() => {
              setAddModalOpen(true);
              setAddSkuId(undefined);
            }}
          >
            Add Adjustment
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto">
          {listError ? (
            <div className="flex items-center justify-center p-8 text-red-600 dark:text-red-400">
              {listErrorDetail instanceof Error
                ? listErrorDetail.message
                : 'Failed to load inventory adjustments'}
            </div>
          ) : (
            <Spin spinning={listLoading}>
              <Table
                rowKey="id"
                columns={columns}
                dataSource={items}
                pagination={{
                  current: page,
                  pageSize,
                  total,
                  showSizeChanger: true,
                  pageSizeOptions: [...DEFAULT_TABLE_PAGE_SIZE_OPTIONS],
                  showTotal: (t, range) =>
                    `Showing ${range[0]}–${range[1]} of ${t}`,
                  onChange: (p, ps) => {
                    setPage(p);
                    if (typeof ps === 'number') setPageSize(ps);
                  },
                }}
              />
            </Spin>
          )}
        </div>
      </Card>

      <Modal
        title="Adjustment Details"
        open={detailModalOpen}
        onCancel={closeDetail}
        footer={null}
        destroyOnHidden
      >
        {detailLoading && !displayDetail ? (
          <Spin />
        ) : displayDetail ? (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Product</span>
              <span className="font-medium">
                {displayDetail.productName} (P{displayDetail.productId})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">SKU</span>
              <span className="font-mono">
                #{displayDetail.skuId}
                {Object.keys(displayDetail.skuAttributes ?? {}).length > 0 &&
                  ` (${formatKeyValuePairs(displayDetail.skuAttributes ?? {})})`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Type</span>
              <span>{displayDetail.adjustmentType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Quantity</span>
              <span>{displayDetail.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Reason</span>
              <span>{displayDetail.reason}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Date</span>
              <span>{formatDateTime(displayDetail.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Adjusted By</span>
              <span>User #{displayDetail.adjustedBy}</span>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={addModalOpen}
        onCancel={() => {
          setAddModalOpen(false);
          setAddSkuId(undefined);
          addForm.resetFields();
        }}
        footer={null}
        destroyOnHidden
        maskClosable={false}
        closable
        centered
        width={700}
        wrapClassName="!flex !items-center !justify-center [&_.ant-modal]:!my-0"
        classNames={{
          content: '!rounded-3xl !p-0 !overflow-hidden',
        }}
        styles={{ body: { padding: 0 } }}
      >
        <div className="overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-5">
          <div className="pr-14">
            <h5 className="mb-3 text-xl font-semibold text-gray-800 dark:text-white/90 lg:text-2xl">
              Add Inventory Adjustment
            </h5>
          </div>
          <Form
            form={addForm}
            layout="vertical"
            onValuesChange={(changed) => {
              if ('productId' in changed) {
                setAddSkuId(undefined);
                setAddProductSearch('');
              }
            }}
          >
            <Form.Item
              name="productId"
              label={
                <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Product
                </span>
              }
              rules={[{ required: true, message: 'Please select a product' }]}
              className="!mb-5"
            >
              <Select
                placeholder="Type to search products..."
                options={productOptions}
                showSearch
                filterOption={false}
                onSearch={setAddProductSearch}
                loading={productsFetching}
                notFoundContent={
                  productsFetching ? <Spin size="small" /> : 'No products found'
                }
                className="!h-11"
              />
            </Form.Item>
            <div className="!mb-5">
              <div className="mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-400">
                SKU
              </div>
              <Select
                value={addSkuId}
                onChange={setAddSkuId}
                placeholder={
                  selectedProduct ? 'Select SKU' : 'Select a product first'
                }
                options={skuOptions}
                disabled={!selectedProduct?.skus?.length}
                className="!h-11 !w-full"
              />
            </div>
            <Form.Item
              name="adjustmentType"
              label={
                <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Adjustment Type
                </span>
              }
              rules={[
                { required: true, message: 'Please select increase or decrease' },
              ]}
              className="!mb-5"
            >
              <Select
                placeholder="Increase or Decrease"
                options={inventoryAdjustmentTypeValues.map((t) => ({
                  label: t,
                  value: t,
                }))}
                className="!h-11"
              />
            </Form.Item>
            <Form.Item
              name="quantity"
              label={
                <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Quantity
                </span>
              }
              rules={[
                { required: true, message: 'Please enter quantity' },
                { type: 'number', min: 1, message: 'Quantity must be at least 1' },
              ]}
              className="!mb-5"
            >
              <InputNumber
                min={1}
                step={1}
                placeholder="e.g. 10"
                className="!h-11 !w-full !rounded-lg !border-gray-300 !px-4 !py-2.5 !text-sm !shadow-theme-xs focus:!border-brand-300 focus:!ring-3 focus:!ring-brand-500/10 dark:!border-gray-700 dark:!bg-gray-900 dark:!text-white/90 dark:focus:!border-brand-800"
              />
            </Form.Item>
            <Form.Item
              name="reason"
              label={
                <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Reason
                </span>
              }
              rules={[{ required: true, message: 'Please enter a reason' }]}
              className="!mb-5"
            >
              <Input.TextArea
                rows={3}
                placeholder="e.g. Stock take correction"
                className="!rounded-lg !border-gray-300 !px-4 !py-2.5 !text-sm dark:!border-gray-700 dark:!bg-gray-900 dark:!text-white/90"
              />
            </Form.Item>
            <Form.Item
              name="adjustedBy"
              label={
                <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Adjusted By
                </span>
              }
              rules={[{ required: true, message: 'Please enter user ID' }]}
              className="!mb-0"
            >
              <InputNumber
                min={1}
                step={1}
                placeholder="e.g. 1"
                className="!h-11 !w-full !rounded-lg !border-gray-300 !px-4 !py-2.5 !text-sm !shadow-theme-xs focus:!border-brand-300 focus:!ring-3 focus:!ring-brand-500/10 dark:!border-gray-700 dark:!bg-gray-900 dark:!text-white/90 dark:focus:!border-brand-800"
              />
            </Form.Item>
            <div className="mt-6 flex justify-end">
              <Button
                type="primary"
                onClick={handleAddSubmit}
                loading={createMutation.isPending}
                className="!h-11 !w-full !rounded-lg !border-0 !bg-brand-500 !px-5 !py-3.5 !text-sm !font-medium !text-white !shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:!bg-brand-600 sm:!w-auto"
              >
                Save Adjustment
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
}
