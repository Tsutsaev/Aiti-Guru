import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  Input,
  Button,
  Avatar,
  Space,
  Tooltip,
  Dropdown,
  Badge,
  Pagination,
  Typography,
} from 'antd';
import type { TableProps } from 'antd';
import {
  SearchOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
  FilterOutlined,
  GlobalOutlined,
  MailOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  UserOutlined,
  PlusOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import { fetchProducts } from '../api/products';
import { useAuthStore } from '../store/authStore';
import AddProductModal from '../components/ui/AddProductModal';
import StockBars from '../components/ui/StockBars';
import TopProgressBar from '../components/ui/TopProgressBar';
import type { Product, SortState } from '../types';
import type { SorterResult } from 'antd/es/table/interface';
import { useDebounce } from '../hooks/useDebounce';

const { Text } = Typography;

const PAGE_SIZE = 20;

const ProductsPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 600);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const sort: SortState = {
    field: (searchParams.get('sortBy') as keyof Product) ?? null,
    order: (searchParams.get('order') as SortState['order']) ?? 'asc',
  };

  const setSort = (next: SortState) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (next.field) {
        params.set('sortBy', next.field as string);
        params.set('order', next.order);
      } else {
        params.delete('sortBy');
        params.delete('order');
      }
      return params;
    });
  };

  const skip = (page - 1) * PAGE_SIZE;

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['products', skip, sort.field, sort.order, debouncedSearch],
    queryFn: () =>
      fetchProducts({
        limit: PAGE_SIZE,
        skip,
        sortBy: sort.field ?? undefined,
        order: sort.field ? sort.order : undefined,
        search: debouncedSearch || undefined,
      }),
    placeholderData: (prev) => prev,
  });

  const handleTableChange: TableProps<Product>['onChange'] = (
    _pagination,
    _filters,
    sorter
  ) => {
    const s = sorter as SorterResult<Product>;
    if (s.columnKey && s.order) {
      setSort({
        field: s.columnKey as keyof Product,
        order: s.order === 'ascend' ? 'asc' : 'desc',
      });
    } else {
      setSort({ field: null, order: 'asc' });
    }
    setPage(1);
  };

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Выйти',
      onClick: handleLogout,
    },
  ];

  const columns: TableProps<Product>['columns'] = [
    {
      title: <span style={styles.colHeader}>Наименование</span>,
      dataIndex: 'title',
      key: 'title',
      sorter: true,
      sortOrder:
        sort.field === 'title' ? (sort.order === 'asc' ? 'ascend' : 'descend') : null,
      render: (title: string, record: Product) => (
        <Space size={10}>
          <Avatar
            src={record.thumbnail}
            shape="square"
            size={36}
            style={{ borderRadius: 4, flexShrink: 0, border: '1px solid #f0f0f0' }}
          />
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontWeight: 500, fontSize: 13, color: '#262626' }}>
              {title.length > 24 ? title.slice(0, 24) + '…' : title}
            </div>
            <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 1 }}>
              {record.category}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: <span style={styles.colHeader}>Вендор</span>,
      dataIndex: 'brand',
      key: 'brand',
      sorter: true,
      sortOrder:
        sort.field === 'brand' ? (sort.order === 'asc' ? 'ascend' : 'descend') : null,
      render: (brand: string) => (
        <Text style={{ fontWeight: 600, fontSize: 13, color: '#262626' }}>{brand}</Text>
      ),
    },
    {
      title: <span style={styles.colHeader}>Артикул</span>,
      dataIndex: 'sku',
      key: 'sku',
      render: (sku: string) => (
        <Text style={{ fontSize: 13, color: '#8c8c8c' }}>{sku}</Text>
      ),
    },
    {
      title: <span style={styles.colHeader}>Оценка</span>,
      dataIndex: 'rating',
      key: 'rating',
      sorter: true,
      sortOrder:
        sort.field === 'rating' ? (sort.order === 'asc' ? 'ascend' : 'descend') : null,
      render: (rating: number) => (
        <Text
          style={{
            color: rating < 3 ? '#ff4d4f' : '#262626',
            fontWeight: 500,
            fontSize: 13,
          }}
        >
          {rating.toFixed(1)}/5
        </Text>
      ),
    },
    {
      title: <span style={styles.colHeader}>Цена, ₽</span>,
      dataIndex: 'price',
      key: 'price',
      sorter: true,
      sortOrder:
        sort.field === 'price' ? (sort.order === 'asc' ? 'ascend' : 'descend') : null,
      render: (price: number) => (
        <Text style={{ fontSize: 13, color: '#262626' }}>
          {price.toLocaleString('ru-RU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
      ),
    },
    {
      title: <span style={styles.colHeader}>Количество</span>,
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => (
        <Tooltip title={`${stock} шт.`}>
          <StockBars stock={stock} />
        </Tooltip>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 72,
      render: () => (
        <Space size={6}>
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            style={{ borderRadius: 6, width: 28, height: 28, padding: 0 }}
          />
          <Button
            size="small"
            icon={<EllipsisOutlined />}
            style={{ borderRadius: 6, width: 28, height: 28, padding: 0 }}
          />
        </Space>
      ),
    },
  ];

  const total = data?.total ?? 0;
  const from = total === 0 ? 0 : skip + 1;
  const to = Math.min(skip + PAGE_SIZE, total);

  return (
    <div style={styles.page}>
      <TopProgressBar loading={isFetching} />

      <header style={styles.header}>
        <span style={styles.headerTitle}>Товары</span>

        <Input
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          placeholder="Искать"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          style={styles.searchInput}
          allowClear
        />

        <div style={styles.headerRight}>
          <Tooltip title="Регион">
            <GlobalOutlined style={styles.headerIcon} />
          </Tooltip>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Badge count={10} size="small" offset={[-2, 2]}>
              <Avatar
                icon={<UserOutlined />}
                size={32}
                style={{ cursor: 'pointer', background: '#1677ff' }}
              />
            </Badge>
          </Dropdown>

          <Tooltip title="Сообщения">
            <MailOutlined style={styles.headerIcon} />
          </Tooltip>
          <Tooltip title="Приложения">
            <AppstoreOutlined style={styles.headerIcon} />
          </Tooltip>
        </div>
      </header>

      <div style={styles.contentWrap}>
        <div style={styles.card}>
          <div style={styles.subHeader}>
            <Text style={{ fontWeight: 600, fontSize: 14, color: '#262626' }}>
              Все позиции
            </Text>
            <Space size={8}>
              <Tooltip title="Обновить">
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => refetch()}
                  loading={isFetching}
                  style={styles.iconBtn}
                />
              </Tooltip>
              <Tooltip title="Фильтры">
                <Button icon={<FilterOutlined />} style={styles.iconBtn} />
              </Tooltip>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={() => setModalOpen(true)}
                style={styles.addBtn}
              >
                Добавить
              </Button>
            </Space>
          </div>

          <Table<Product>
            rowKey="id"
            columns={columns}
            dataSource={data?.products ?? []}
            loading={isFetching}
            onChange={handleTableChange}
            rowSelection={{ type: 'checkbox' }}
            pagination={false}
            size="small"
            scroll={{ x: 800 }}
            style={{ borderTop: '1px solid #f0f0f0' }}
          />

          <div style={styles.paginationRow}>
            <Text style={{ fontSize: 12, color: '#8c8c8c' }}>
              Показано {from}–{to} из {total}
            </Text>
            <Pagination
              current={page}
              pageSize={PAGE_SIZE}
              total={total}
              onChange={(p) => setPage(p)}
              showSizeChanger={false}
              size="small"
            />
          </div>
        </div>
      </div>

      <AddProductModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#f5f6f7',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    background: '#ffffff',
    padding: '0 24px',
    height: 56,
    borderBottom: '1px solid #e8e8e8',
    gap: 16,
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  headerTitle: {
    fontWeight: 700,
    fontSize: 16,
    color: '#141414',
    flexShrink: 0,
  },
  searchInput: {
    flex: 1,
    maxWidth: 500,
    borderRadius: 6,
  },
  headerRight: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: 18,
  },
  headerIcon: {
    fontSize: 17,
    color: '#595959',
    cursor: 'pointer',
  },
  contentWrap: {
    padding: '16px 24px 24px',
    flex: 1,
  },
  card: {
    background: '#ffffff',
    borderRadius: 8,
    border: '1px solid #e8e8e8',
    overflow: 'hidden',
  },
  subHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
  },
  iconBtn: {
    borderRadius: 6,
    color: '#595959',
  },
  addBtn: {
    borderRadius: 6,
    fontWeight: 600,
  },
  paginationRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    borderTop: '1px solid #f0f0f0',
  },
  colHeader: {
    fontSize: 12,
    color: '#8c8c8c',
    fontWeight: 500,
  },
};

export default ProductsPage;