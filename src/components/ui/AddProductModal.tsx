import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Form, Input, InputNumber, Button, notification } from 'antd';

const schema = z.object({
  title: z.string().min(1, 'Введите наименование'),
  price: z
    .number({ message: 'Введите цену' })
    .positive('Цена должна быть больше 0'),
  brand: z.string().min(1, 'Введите вендора'),
  sku: z.string().min(1, 'Введите артикул'),
});

type FormValues = z.infer<typeof schema>;

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
}

const AddProductModal = ({ open, onClose }: AddProductModalProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', price: 0, brand: '', sku: '' },
  });

  const onSubmit = (values: FormValues) => {
    notification.success({
      message: 'Товар добавлен',
      description: `«${values.title}» успешно добавлен в список`,
      placement: 'topRight',
    });
    reset();
    onClose();
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      title="Добавить товар"
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={480}
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)} style={{ marginTop: 16 }}>
        <Form.Item
          label="Наименование"
          validateStatus={errors.title ? 'error' : ''}
          help={errors.title?.message}
        >
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Введите наименование товара" />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Цена (₽)"
          validateStatus={errors.price ? 'error' : ''}
          help={errors.price?.message}
        >
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <InputNumber
                value={field.value}
                onChange={(val) => field.onChange(val ?? 0)}
                onBlur={field.onBlur}
                placeholder="0.00"
                style={{ width: '100%' }}
                min={0}
                precision={2}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Вендор"
          validateStatus={errors.brand ? 'error' : ''}
          help={errors.brand?.message}
        >
          <Controller
            name="brand"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Производитель / бренд" />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Артикул"
          validateStatus={errors.sku ? 'error' : ''}
          help={errors.sku?.message}
        >
          <Controller
            name="sku"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="SKU / артикул" />
            )}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            Отмена
          </Button>
          <Button type="primary" htmlType="submit">
            Добавить
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddProductModal;