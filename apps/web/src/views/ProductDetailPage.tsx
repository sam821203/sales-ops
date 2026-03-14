import { Link, useParams, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import type { SKU } from '@/api/types';
import type { AttributeDefinition } from '@/constants/attributeDefinitions';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { Avatar, Button, Spin, Table, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import { Card } from '@/components/common/Card';
import { ProductEditModal } from '@/components/ProductEditModal';
import { getProductById, productKeys } from '@/api/products';
import { formatPrice, formatKeyValuePairs } from '@/utils/format';
import { getProductStatusClass, getStockStatusClass } from '@/utils/statusClasses';

const formatSkuId = (id: number) => `SKU${String(id).padStart(3, '0')}`;

const renderHeaderTitle = (label: string) => (
  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">{label}</span>
);

export function ProductDetailPage() {
  const { productId } = useParams({ strict: false });
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const id = productId != null ? Number(productId) : NaN;
  const isValidId = Number.isInteger(id) && id > 0;

  const { data: product, isLoading, isError, error } = useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProductById(id),
    enabled: isValidId,
  });

  if (!isValidId) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-6">
        <nav className="flex items-center gap-1.5 text-sm">
          <Link
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            to="/"
          >
            Home
          </Link>
          <span className="text-gray-400 dark:text-gray-500">/</span>
          <Link
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            to="/ecommerce/products"
          >
            Products
          </Link>
          <span className="text-gray-400 dark:text-gray-500">/</span>
          <span className="text-gray-800 dark:text-white/90">Invalid product</span>
        </nav>
        <Card title="Product not found" description="The product ID is invalid.">
          <Button type="primary" icon={<ArrowLeftOutlined />} onClick={() => navigate({ to: '/ecommerce/products' })}>
            Back to Products
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-6">
        <nav className="flex items-center gap-1.5 text-sm">
          <Link
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            to="/"
          >
            Home
          </Link>
          <span className="text-gray-400 dark:text-gray-500">/</span>
          <Link
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            to="/ecommerce/products"
          >
            Products
          </Link>
          <span className="text-gray-400 dark:text-gray-500">/</span>
          <span className="text-gray-800 dark:text-white/90">…</span>
        </nav>
        <div className="flex flex-1 items-center justify-center py-12">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    const message = isError && error instanceof Error ? error.message : 'Product not found.';
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-6">
        <nav className="flex items-center gap-1.5 text-sm">
          <Link
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            to="/"
          >
            Home
          </Link>
          <span className="text-gray-400 dark:text-gray-500">/</span>
          <Link
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            to="/ecommerce/products"
          >
            Products
          </Link>
          <span className="text-gray-400 dark:text-gray-500">/</span>
          <span className="text-gray-800 dark:text-white/90">Product</span>
        </nav>
        <Card title="Product not found" description={message}>
          <Button type="primary" icon={<ArrowLeftOutlined />} onClick={() => navigate({ to: '/ecommerce/products' })}>
            Back to Products
          </Button>
        </Card>
      </div>
    );
  }

  const skuColumns: TableColumnsType<SKU & { key: number }> = [
    {
      title: renderHeaderTitle('SKU ID'),
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (skuId: number) => (
        <span className="whitespace-nowrap text-gray-800 dark:text-white/90">{formatSkuId(skuId)}</span>
      ),
    },
    {
      title: renderHeaderTitle('Attributes'),
      key: 'attributes',
      render: (_value, sku) => (
        <span className="text-body dark:text-bodydark2">
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
        <span className="text-gray-800 dark:text-white/90">{formatPrice(sku.price)}</span>
      ),
    },
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="flex items-center gap-1.5 text-sm">
          <Link
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            to="/"
          >
            Home
          </Link>
          <span className="text-gray-400 dark:text-gray-500">/</span>
          <Link
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            to="/ecommerce/products"
          >
            Products
          </Link>
          <span className="text-gray-400 dark:text-gray-500">/</span>
          <span className="text-gray-800 dark:text-white/90">{product.name}</span>
        </nav>
        <Button
          type="default"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate({ to: '/ecommerce/products' })}
          className="!inline-flex !items-center !gap-2"
        >
          Back to Products
        </Button>
      </div>

      <Card
        title="Basic information"
        description="Product identity and status."
        actions={
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => setEditModalOpen(true)}
            className="!inline-flex !items-center !gap-2 !border-amber-500 !bg-amber-500 !text-white hover:!border-amber-600 hover:!bg-amber-600"
          >
            Edit
          </Button>
        }
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          <Avatar
            src={product.imageUrl}
            shape="square"
            size={120}
            className="shrink-0 !rounded-lg"
          >
            {product.name?.charAt(0) ?? '?'}
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">{product.name}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <Tag bordered={false} className={getProductStatusClass(product.status)}>
                {product.status}
              </Tag>
            </div>
            <dl className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-medium text-gray-500 dark:text-gray-400">Category</dt>
                <dd className="text-gray-800 dark:text-white/90">
                  {product.categoryId != null ? `ID ${product.categoryId}` : '—'}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500 dark:text-gray-400">Brand</dt>
                <dd className="text-gray-800 dark:text-white/90">
                  {product.brandId != null ? `ID ${product.brandId}` : '—'}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500 dark:text-gray-400">SKUs</dt>
                <dd className="text-gray-800 dark:text-white/90">{product.skus.length}</dd>
              </div>
            </dl>
          </div>
        </div>
      </Card>

      {product.attributeDefinitions && product.attributeDefinitions.length > 0 && (
        <Card title="Attribute definitions" description="Attributes used for product variants (SKUs).">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[320px] text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-2 pr-4 text-left font-semibold text-gray-500 dark:text-gray-400">Key</th>
                  <th className="pb-2 pr-4 text-left font-semibold text-gray-500 dark:text-gray-400">Label</th>
                  <th className="pb-2 pr-4 text-left font-semibold text-gray-500 dark:text-gray-400">Type</th>
                  <th className="pb-2 text-left font-semibold text-gray-500 dark:text-gray-400">Options</th>
                </tr>
              </thead>
              <tbody>
                {product.attributeDefinitions.map((def: AttributeDefinition) => (
                  <tr key={def.key} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 pr-4 text-gray-800 dark:text-white/90">{def.key}</td>
                    <td className="py-2 pr-4 text-gray-800 dark:text-white/90">{def.label}</td>
                    <td className="py-2 pr-4 text-gray-600 dark:text-gray-300">{def.type}</td>
                    <td className="py-2 text-gray-600 dark:text-gray-300">
                      {def.type === 'enum' ? def.options?.join(', ') ?? '—' : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Card
        title="SKUs"
        description={`${product.skus.length} variant(s) with price and stock.`}
        bodyClassName="p-0"
        disableBodyPadding
      >
        <Table<SKU & { key: number }>
          tableLayout="fixed"
          size="large"
          pagination={false}
          rowKey="id"
          dataSource={product.skus.map((sku) => ({ ...sku, key: sku.id }))}
          columns={skuColumns}
          locale={{ emptyText: 'No SKUs.' }}
        />
      </Card>

      <ProductEditModal
        open={editModalOpen}
        productId={isValidId ? id : null}
        onClose={() => setEditModalOpen(false)}
      />
    </div>
  );
}
