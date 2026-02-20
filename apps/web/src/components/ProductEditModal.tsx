import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProductStatus, UpdateProductInput } from '@salesops/shared';
import { Avatar, Button, Form, Input, Modal, Select, Upload, message } from 'antd';
import { getProductById, productKeys, updateProduct } from '@/api/products';
import { uploadProductImage } from '@/api/upload';

function ProductImageUploadField({
  form,
}: {
  form: ReturnType<typeof Form.useForm<{ name: string; status: ProductStatus; imageUrl?: string }>>[0];
}) {
  const imageUrl = Form.useWatch('imageUrl', form);
  const [loading, setLoading] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      {imageUrl && (
        <Avatar src={imageUrl} shape="square" size={64} className="shrink-0" />
      )}
      <Upload
        showUploadList={false}
        accept="image/jpeg,image/png,image/gif,image/webp"
        customRequest={async ({ file, onSuccess, onError }) => {
          setLoading(true);
          try {
            const { url } = await uploadProductImage(file as File);
            form.setFieldValue('imageUrl', url);
            onSuccess?.(url);
          } catch (e) {
            message.error((e as Error).message ?? 'Upload failed');
            onError?.(e as Error);
          } finally {
            setLoading(false);
          }
        }}
      >
        <Button loading={loading}>Choose image</Button>
      </Upload>
    </div>
  );
}

export interface ProductEditModalProps {
  open: boolean;
  productId: number | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ProductEditModal({ open, productId, onClose, onSuccess }: ProductEditModalProps) {
  const queryClient = useQueryClient();
  const [form] = Form.useForm<{ name: string; status: ProductStatus; imageUrl?: string }>();

  const productQuery = useQuery({
    queryKey: productKeys.detail(productId!),
    queryFn: () => getProductById(productId!),
    enabled: open && productId != null,
  });

  useEffect(() => {
    if (open && productQuery.data && productId != null && productQuery.data.id === productId) {
      form.setFieldsValue({
        name: productQuery.data.name,
        status: productQuery.data.status,
        imageUrl: productQuery.data.imageUrl,
      });
    }
  }, [open, productId, productQuery.data, form]);

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateProductInput }) => updateProduct(id, body),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
      form.resetFields();
      onClose();
      onSuccess?.();
      message.success('Product updated.');
    },
    onError: (e: Error) => message.error(e.message || 'Failed to update product'),
  });

  const handleOk = () => {
    if (productId == null) return;
    form.validateFields()
      .then((values) => {
        updateMutation.mutate({
          id: productId,
          body: {
            name: values.name,
            status: values.status,
            ...(values.imageUrl !== undefined && { imageUrl: values.imageUrl }),
          },
        });
      })
      .catch(() => {});
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const showForm = open && productId != null && productQuery.data && productQuery.data.id === productId;

  return (
    <Modal
      title="Edit Product"
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText="Save"
      confirmLoading={updateMutation.isPending}
      destroyOnHidden
    >
      {showForm && (
        <Form
          form={form}
          layout="vertical"
          className="mt-4"
          initialValues={{
            name: productQuery.data!.name,
            status: productQuery.data!.status,
            imageUrl: productQuery.data!.imageUrl,
          }}
        >
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Required' }]}>
            <Input placeholder="Product name" maxLength={255} showCount />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'Draft', label: 'Draft' },
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
              ]}
            />
          </Form.Item>
          <Form.Item name="imageUrl" label="Product image">
            <ProductImageUploadField form={form} />
          </Form.Item>
        </Form>
      )}
      {open && productId != null && productQuery.isLoading && (
        <p className="text-body dark:text-bodydark2">Loading...</p>
      )}
      {open && productId != null && !productQuery.isLoading && !productQuery.data && (
        <p className="text-body dark:text-bodydark2">Product not found.</p>
      )}
    </Modal>
  );
}
