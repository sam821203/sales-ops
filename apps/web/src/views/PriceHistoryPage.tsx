import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowDownOutlined, ArrowUpOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { App, Button, Form, Input, InputNumber, Modal, Select, Spin, Table, Tag } from 'antd';
import { useNotification } from '@/context/NotificationContext';
import type { TableColumnsType } from 'antd';
import { Card } from '@/components/common/Card';
import { DataBoundary } from '@/components/DataBoundary';
import {
  createPriceHistory,
  getPriceHistoryById,
  getPriceHistoryList,
  priceHistoryKeys,
} from '@/api/priceHistory';
import type {
  PriceHistoryItem,
  PriceHistoryListResponse,
} from '@/api/types';
import { getProductById, getProducts, productKeys } from '@/api/products';
import { DEFAULT_TABLE_PAGE_SIZE, DEFAULT_TABLE_PAGE_SIZE_OPTIONS } from '@/constants/pagination';
import { formatPrice, formatKeyValuePairs } from '@/utils/format';

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

export function PriceHistoryPage(): React.ReactElement {
  const notification = useNotification();
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_TABLE_PAGE_SIZE);
  const [q, setQ] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<PriceHistoryItem | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailId, setDetailId] = useState<number | null>(null);

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
  } = useQuery<PriceHistoryListResponse>({
    queryKey: priceHistoryKeys.list(listParams),
    queryFn: () => getPriceHistoryList(listParams),
  });

  const detailIdNum = detailId ?? 0;
  const { data: detailRecord, isLoading: detailLoading } = useQuery({
    queryKey: priceHistoryKeys.detail(detailIdNum),
    queryFn: () => getPriceHistoryById(detailIdNum),
    enabled: detailId != null && detailId > 0,
  });

  const [addSkuId, setAddSkuId] = useState<number | undefined>(undefined);
  const [addProductSearch, setAddProductSearch] = useState('');
  const [addProductSearchDebounced, setAddProductSearchDebounced] = useState('');
  const addProductSearchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [addForm] = Form.useForm<{
    productId: number;
    newPrice: number;
    changedBy: number;
  }>();

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

  const selectedId = selectedProductId ?? 0;
  const { data: selectedProduct } = useQuery({
    queryKey: productKeys.detail(selectedId),
    queryFn: () => getProductById(selectedId),
    enabled: addModalOpen && selectedProductId != null && selectedProductId > 0,
  });

  const createMutation = useMutation({
    mutationFn: (body: Parameters<typeof createPriceHistory>[0]) => createPriceHistory(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: priceHistoryKeys.all });
      setAddModalOpen(false);
      setAddSkuId(undefined);
      addForm.resetFields();
      notification.success({ message: 'Price change created.' });
    },
  });

  const items: PriceHistoryItem[] = listResponse?.items ?? [];
  const total = listResponse?.total ?? 0;

  const openDetail = (record: PriceHistoryItem): void => {
    setDetailItem(record);
    setDetailId(record.id);
    setDetailModalOpen(true);
  };

  const closeDetail = (): void => {
    setDetailModalOpen(false);
    setDetailId(null);
    setDetailItem(null);
  };

  const handleAddSubmit = (): void => {
    if (addSkuId == null) {
      message.error('Please select a SKU');
      return;
    }
    addForm.validateFields().then((values) => {
      createMutation.mutate({
        skuId: addSkuId,
        newPrice: values.newPrice,
        changedBy: values.changedBy,
      });
    }).catch(() => {});
  };

  const productOptions = useMemo((): { label: string; value: number }[] => {
    const list = productsResponse?.items ?? [];
    const options = list.map((p) => ({
      label: `${p.name} (P${p.id})`,
      value: p.id,
    }));
    if (selectedProduct && !list.some((p) => p.id === selectedProduct.id)) {
      options.unshift({
        label: `${selectedProduct.name} (P${selectedProduct.id})`,
        value: selectedProduct.id,
      });
    }
    return options;
  }, [productsResponse?.items, selectedProduct]);

  const skuOptions = useMemo(() => {
    const skus = selectedProduct?.skus ?? [];
    const options = skus.map((s) => ({
      label: `SKU #${s.id} – ${formatPrice(s.price)}${Object.keys(s.attributes ?? {}).length > 0 ? ` (${formatKeyValuePairs(s.attributes ?? {})})` : ''}`,
      value: s.id,
    }));
    return options;
  }, [selectedProduct?.skus]);

  const selectedSku = useMemo(
    () => selectedProduct?.skus?.find((s) => s.id === addSkuId),
    [selectedProduct?.skus, addSkuId]
  );

  const columns: TableColumnsType<PriceHistoryItem> = useMemo(
    () => [
      {
        title: 'Product',
        key: 'product',
        render: (_: unknown, record: PriceHistoryItem) => (
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
        render: (_: unknown, record: PriceHistoryItem) => (
          <div className="text-sm">
            <span className="font-mono text-gray-600 dark:text-gray-300">#{record.skuId}</span>
            {Object.keys(record.skuAttributes ?? {}).length > 0 && (
              <span className="ml-1 text-gray-500 dark:text-gray-400">
                ({formatKeyValuePairs(record.skuAttributes ?? {})})
              </span>
            )}
          </div>
        ),
      },
      {
        title: 'Old Price',
        dataIndex: 'oldPrice',
        key: 'oldPrice',
        align: 'right',
        render: (val: number) => <span className="text-gray-500 dark:text-gray-400">{formatPrice(val)}</span>,
      },
      {
        title: 'New Price',
        dataIndex: 'newPrice',
        key: 'newPrice',
        align: 'right',
        render: (val: number) => <span className="font-medium">{formatPrice(val)}</span>,
      },
      {
        title: 'Change',
        key: 'change',
        render: (_: unknown, record: PriceHistoryItem) => {
          const diff = record.newPrice - record.oldPrice;
          const isIncrease = diff > 0;
          const isUnchanged = diff === 0;
          const formatted =
            isUnchanged
              ? formatPrice(0)
              : isIncrease
                ? `+${formatPrice(diff)}`
                : `-${formatPrice(-diff)}`;
          return (
            <Tag
              color={isUnchanged ? 'default' : isIncrease ? 'red' : 'green'}
              className="flex items-center gap-1 w-fit"
            >
              {isUnchanged ? null : isIncrease ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              {formatted}
            </Tag>
          );
        },
      },
      {
        title: 'Date',
        dataIndex: 'effectiveDate',
        key: 'effectiveDate',
        render: (val: Date | string) => (
          <span className="text-sm text-gray-500 dark:text-gray-400">{formatDateTime(val)}</span>
        ),
      },
      {
        title: 'Changed By',
        dataIndex: 'changedBy',
        key: 'changedBy',
        render: (val: number) => <span className="text-sm">User #{val}</span>,
      },
      {
        title: '',
        key: 'actions',
        width: 64,
        render: (_: unknown, record: PriceHistoryItem) => (
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

  const displayDetail: PriceHistoryItem | null =
    (detailRecord ?? detailItem) ?? null;

  return (
    <div className="space-y-6">
      <h1 className="text-title-md2 font-semibold text-black dark:text-white">
        Product Price History
      </h1>

      <Card
        className="flex min-h-0 flex-1 flex-col"
        bodyClassName="flex min-h-0 flex-1 flex-col overflow-hidden"
        disableBodyPadding
      >
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <div className="w-full min-w-0 sm:max-w-[320px]">
            <Input.Search
              allowClear
              size="large"
              placeholder="Search by product..."
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
              className="price-history-search-input"
            />
          </div>
          <Button
            type="default"
            size="large"
            icon={<PlusOutlined />}
            className="!inline-flex !shrink-0 !items-center !gap-2 !rounded-lg !border-brand-500 !bg-brand-500 !px-4 !text-sm !font-medium !text-white hover:!border-brand-600 hover:!bg-brand-600"
            onClick={() => { setAddModalOpen(true); setAddSkuId(undefined); }}
          >
            Add Price Change
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto">
          <DataBoundary
            isLoading={listLoading && listResponse == null}
            isError={listError && listResponse == null}
            error={listErrorDetail}
            fallbackMessage="Failed to load price history"
            variant="inline"
          >
            <Table
              rowKey="id"
              columns={columns}
              dataSource={items}
              loading={listLoading}
              pagination={{
                current: page,
                pageSize,
                total,
                showSizeChanger: true,
                pageSizeOptions: [...DEFAULT_TABLE_PAGE_SIZE_OPTIONS],
                showTotal: (t, range) => `Showing ${range[0]}–${range[1]} of ${t}`,
                onChange: (p, ps) => {
                  setPage(p);
                  if (typeof ps === 'number') setPageSize(ps);
                },
              }}
            />
          </DataBoundary>
        </div>
      </Card>

      <Modal
        title="Price Change Details"
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
              <span className="text-gray-500 dark:text-gray-400">Old Price</span>
              <span>{formatPrice(displayDetail.oldPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">New Price</span>
              <span className="font-medium">{formatPrice(displayDetail.newPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Date</span>
              <span>{formatDateTime(displayDetail.effectiveDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Changed By</span>
              <span>User #{displayDetail.changedBy}</span>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={addModalOpen}
        onCancel={() => { setAddModalOpen(false); setAddSkuId(undefined); addForm.resetFields(); }}
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
            <h5 className="mb-3 font-semibold text-gray-800 dark:text-white/90 text-xl lg:text-2xl">
              Add Price Change
            </h5>
          </div>
          <Form form={addForm} layout="vertical" onValuesChange={(changed) => {
              if ('productId' in changed) {
                setAddSkuId(undefined);
                setAddProductSearch('');
              }
            }}>
            <Form.Item
              name="productId"
              label={<span className="text-sm font-medium text-gray-700 dark:text-gray-400">Product</span>}
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
                notFoundContent={productsFetching ? <Spin size="small" /> : 'No products found'}
                className="!h-11"
              />
            </Form.Item>
            <div className="!mb-5">
              <div className="mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-400">SKU</div>
              <Select
                value={addSkuId}
                onChange={setAddSkuId}
                placeholder={selectedProduct ? 'Select SKU' : 'Select a product first'}
                options={skuOptions}
                disabled={!selectedProduct?.skus?.length}
                className="!h-11 !w-full"
              />
            </div>
            {selectedSku != null && (
              <Form.Item
                label={<span className="text-sm font-medium text-gray-700 dark:text-gray-400">Old Price (current)</span>}
                className="!mb-5"
              >
                <div className="!h-11 !flex !items-center !rounded-lg !border !border-gray-300 !px-4 !py-2.5 !text-sm dark:!border-gray-700 dark:!bg-gray-900">
                  {formatPrice(selectedSku.price)}
                </div>
              </Form.Item>
            )}
            <Form.Item
              name="newPrice"
              label={<span className="text-sm font-medium text-gray-700 dark:text-gray-400">New Price</span>}
              rules={[{ required: true, message: 'Please enter new price' }]}
              className="!mb-5"
            >
              <InputNumber
                min={0}
                step={0.01}
                placeholder="0.00"
                className="!h-11 !w-full !rounded-lg !border-gray-300 !px-4 !py-2.5 !text-sm !shadow-theme-xs focus:!border-brand-300 focus:!ring-3 focus:!ring-brand-500/10 dark:!border-gray-700 dark:!bg-gray-900 dark:!text-white/90 dark:focus:!border-brand-800"
              />
            </Form.Item>
            <Form.Item
              name="changedBy"
              label={<span className="text-sm font-medium text-gray-700 dark:text-gray-400">Changed By</span>}
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
                Save Price Change
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
}
