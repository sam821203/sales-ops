import { useEffect, useState, type ReactElement } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProductStatus } from '@/api/types';
import type { UpdateProductInput } from '@/api/types';
import { Avatar, Button, Form, Input, Modal, Select, Upload } from 'antd';
import { DataBoundary } from '@/components/DataBoundary';
import { getProductById, productKeys, updateProduct } from '@/api/products';
import { uploadProductImage } from '@/api/upload';
import { useNotification } from '@/context/NotificationContext';

function ProductImageUploadField({
  form,
}: {
  form: ReturnType<typeof Form.useForm<{ name: string; status: ProductStatus; imageUrl?: string }>>[0];
}): ReactElement {
  const notification = useNotification();
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
        customRequest={async ({ file, onSuccess, onError }): Promise<void> => {
          setLoading(true);
          try {
            const fileObj = file instanceof File ? file : undefined;
            if (!fileObj) return;
            const { url } = await uploadProductImage(fileObj);
            form.setFieldValue('imageUrl', url);
            onSuccess?.(url);
          } catch (e) {
            const msg = e instanceof Error ? e.message : 'Upload failed';
            notification.error({ message: 'Upload failed', description: msg });
            onError?.(e instanceof Error ? e : new Error(String(e)));
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

export function ProductEditModal({ open, productId, onClose, onSuccess }: ProductEditModalProps): ReactElement {
  const notification = useNotification();
  const queryClient = useQueryClient();
  const [form] = Form.useForm<{ name: string; status: ProductStatus; imageUrl?: string }>();

  const productIdNum = productId ?? 0;
  const productQuery = useQuery({
    queryKey: productKeys.detail(productIdNum),
    queryFn: () => getProductById(productIdNum),
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
      notification.success({ message: 'Product updated.' });
    },
  });

  const handleOk = (): void => {
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

  const handleCancel = (): void => {
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
      {open && productId != null ? (
        <DataBoundary
          isLoading={productQuery.isLoading}
          isError={!productQuery.isLoading && productQuery.data == null}
          error={productQuery.error}
          fallbackMessage="Product not found."
          variant="inline"
          className="py-4"
        >
          {showForm && productQuery.data ? (
            <Form
              form={form}
              layout="vertical"
              className="mt-4"
              initialValues={{
                name: productQuery.data.name,
                status: productQuery.data.status,
                imageUrl: productQuery.data.imageUrl,
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
          ) : null}
        </DataBoundary>
      ) : null}
    </Modal>
  );
}
