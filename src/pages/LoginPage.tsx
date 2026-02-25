import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, Input, Button, Checkbox, Typography, Alert } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { loginRequest } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import type { LoginFormValues } from '../types';

const { Title, Text, Link } = Typography;

const schema = z.object({
  username: z.string().min(1, 'Введите логин'),
  password: z.string().min(1, 'Введите пароль'),
  remember: z.boolean(),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: '', password: '', remember: false },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setError(null);
    setLoading(true);
    try {
      const user = await loginRequest(values.username, values.password);
      login(user, values.remember);
      navigate('/products');
    } catch {
      setError('Неверный логин или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <div style={styles.logo}>&#9664;</div>
        </div>

        <Title level={3} style={styles.title}>
          Добро пожаловать!
        </Title>
        <Text style={styles.subtitle}>Пожалуйста, авторизуйтесь</Text>

        <Form
          layout="vertical"
          onFinish={handleSubmit(onSubmit)}
          style={styles.form}
          requiredMark={false}
        >
          <Form.Item
            label={<span style={styles.label}>Почта</span>}
            validateStatus={errors.username ? 'error' : ''}
            help={errors.username?.message}
            style={{ marginBottom: 16 }}
          >
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="test@mail.com"
                  size="large"
                  style={styles.input}
                  allowClear
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label={<span style={styles.label}>Пароль</span>}
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message}
            style={{ marginBottom: 16 }}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="••••••••••"
                  size="large"
                  style={styles.input}
                />
              )}
            />
          </Form.Item>

          {error && (
            <Form.Item style={{ marginBottom: 12 }}>
              <Alert message={error} type="error" showIcon />
            </Form.Item>
          )}

          <Form.Item style={{ marginBottom: 20 }}>
            <Controller
              name="remember"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  style={{ fontSize: 13, color: '#595959' }}
                >
                  Запомнить данные
                </Checkbox>
              )}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 12 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={styles.submitBtn}
            >
              Войти
            </Button>
          </Form.Item>

          <div style={styles.divider}>
            <Text style={{ color: '#8c8c8c', fontSize: 13 }}>или</Text>
          </div>

          <div style={styles.footer}>
            <Text style={{ color: '#8c8c8c', fontSize: 13 }}>Нет аккаунта? </Text>
            <Link href="#" style={{ fontSize: 13 }}>
              Создать
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #c9cdd4 0%, #dde1e7 40%, #c9cdd4 100%)',
  },
  card: {
    background: '#ffffff',
    borderRadius: 12,
    padding: '36px 32px 28px',
    width: 360,
    boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
    textAlign: 'center',
  },
  logoWrap: {
    marginBottom: 12,
  },
  logo: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    background: '#141414',
    borderRadius: 8,
    color: '#fff',
    fontSize: 18,
  },
  title: {
    margin: '8px 0 2px',
    fontSize: 22,
    fontWeight: 700,
    color: '#141414',
  },
  subtitle: {
    display: 'block',
    marginBottom: 20,
    color: '#8c8c8c',
    fontSize: 13,
  },
  label: {
    fontSize: 13,
    color: '#262626',
    fontWeight: 500,
  },
  input: {
    borderRadius: 6,
  },
  form: {
    textAlign: 'left',
    marginTop: 4,
  },
  submitBtn: {
    borderRadius: 6,
    fontWeight: 600,
    fontSize: 15,
    height: 42,
    background: '#1677ff',
    border: 'none',
  },
  divider: {
    textAlign: 'center',
    marginBottom: 10,
  },
  footer: {
    textAlign: 'center',
  },
};

export default LoginPage;