import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  CssBaseline,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import {
  Dashboard,
  Group,
  Inventory2,
  Logout,
  Paid,
  People,
  ReceiptLong,
  Refresh,
  Search,
  Settings,
  ShoppingCart,
  Storefront,
} from '@mui/icons-material';

import { api } from './api';

const statusLabels = {
  created: 'Создан',
  confirmed: 'Подтвержден',
  processing: 'В обработке',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменен',
};

const statuses = Object.keys(statusLabels);

const nav = [
  { id: 'dashboard', label: 'Dashboard', icon: <Dashboard /> },
  { id: 'orders', label: 'Заказы', icon: <ReceiptLong /> },
  { id: 'users', label: 'Пользователи', icon: <People /> },
  { id: 'payments', label: 'Платежи', icon: <Paid /> },
];

const formatMoney = (value) => `${Number(value || 0).toLocaleString('ru-RU')} ₽`;
const formatDate = (value) => (value ? new Date(value).toLocaleString('ru-RU') : '');

function LoginScreen({ onLogin }) {
  const [form, setForm] = useState({ login: 'quality', password: 'quality' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login(form);
      localStorage.setItem('adminToken', data.access_token);
      onLogin(data.admin);
    } catch (err) {
      setError(err.message || 'Не удалось войти');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: 'background.default', p: 2 }}>
      <Paper elevation={0} sx={{ width: '100%', maxWidth: 420, p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Stack spacing={2.5} component="form" onSubmit={submit}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ width: 44, height: 44, borderRadius: 1.5, bgcolor: 'primary.main', color: '#fff', display: 'grid', placeItems: 'center' }}>
              <Storefront />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="900">Админка запчастей</Typography>
              <Typography variant="body2" color="text.secondary">Управление заказами и клиентами</Typography>
            </Box>
          </Stack>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Логин" value={form.login} onChange={(event) => setForm({ ...form, login: event.target.value })} autoFocus />
          <TextField label="Пароль" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ height: 46, fontWeight: 900 }}>
            {loading ? <CircularProgress color="inherit" size={22} /> : 'Войти'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

function Shell({ active, setActive, admin, onLogout, children, onRefresh, syncing }) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '260px minmax(0, 1fr)' } }}>
      <Paper elevation={0} sx={{ display: { xs: 'none', md: 'block' }, borderRadius: 0, borderRight: '1px solid', borderColor: 'divider', p: 2 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Box sx={{ width: 38, height: 38, borderRadius: 1.5, bgcolor: 'primary.main', color: '#fff', display: 'grid', placeItems: 'center' }}>
              <Storefront />
            </Box>
            <Box>
              <Typography fontWeight="900">Auto Parts</Typography>
              <Typography variant="caption" color="text.secondary">Admin control</Typography>
            </Box>
          </Stack>
          <Stack spacing={0.8}>
            {nav.map((item) => (
              <Button
                key={item.id}
                startIcon={item.icon}
                onClick={() => setActive(item.id)}
                sx={{
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  fontWeight: 800,
                  color: active === item.id ? 'primary.main' : 'text.secondary',
                  bgcolor: active === item.id ? 'primary.50' : 'transparent',
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        </Stack>
      </Paper>

      <Box sx={{ minWidth: 0 }}>
        <Paper elevation={0} sx={{ borderRadius: 0, borderBottom: '1px solid', borderColor: 'divider', px: { xs: 2, md: 3 }, py: 1.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5}>
            <Box>
              <Typography variant="h5" fontWeight="900">Панель управления</Typography>
              <Typography variant="body2" color="text.secondary">Администратор: {admin?.login || 'quality'}</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <IconButton onClick={onRefresh} disabled={syncing}>{syncing ? <CircularProgress size={20} /> : <Refresh />}</IconButton>
              <Button color="error" variant="outlined" startIcon={<Logout />} onClick={onLogout} sx={{ fontWeight: 800, textTransform: 'none' }}>
                Выйти
              </Button>
            </Stack>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ mt: 1.5, display: { xs: 'flex', md: 'none' }, overflowX: 'auto' }}>
            {nav.map((item) => (
              <Chip key={item.id} icon={item.icon} label={item.label} color={active === item.id ? 'primary' : 'default'} onClick={() => setActive(item.id)} />
            ))}
          </Stack>
        </Paper>
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1320, mx: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, minWidth: 0 }}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box sx={{ color, bgcolor: alpha(color, 0.1), borderRadius: 1.5, width: 42, height: 42, display: 'grid', placeItems: 'center' }}>
          {icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary" fontWeight="800">{label}</Typography>
          <Typography variant="h6" fontWeight="900" noWrap>{value}</Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

function DashboardPage({ stats, setActive, setSelectedOrder }) {
  const theme = useTheme();
  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' } }}>
        <StatCard label="Всего заказов" value={stats.orders_count || 0} icon={<ShoppingCart />} color={theme.palette.primary.main} />
        <StatCard label="Сумма заказов" value={formatMoney(stats.orders_amount)} icon={<ReceiptLong />} color={theme.palette.info.main} />
        <StatCard label={`Маржа ${stats.markup_part || 30}%`} value={formatMoney(stats.profit_amount)} icon={<Paid />} color={theme.palette.success.main} />
        <StatCard label="Пользователи" value={stats.users_count || 0} icon={<Group />} color={theme.palette.warning.main} />
      </Box>

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight="900">Последние заказы</Typography>
        </Box>
        <Stack divider={<Divider />}>
          {(stats.recent_orders || []).map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              onClick={() => {
                setSelectedOrder(order);
                setActive('orders');
              }}
            />
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}

function StatusChip({ status }) {
  const theme = useTheme();
  const color = {
    created: theme.palette.info.main,
    confirmed: theme.palette.primary.main,
    processing: theme.palette.warning.main,
    shipped: theme.palette.secondary.main,
    delivered: theme.palette.success.main,
    cancelled: theme.palette.error.main,
  }[status] || theme.palette.text.secondary;
  return <Chip size="small" label={statusLabels[status] || status} sx={{ color, bgcolor: alpha(color, 0.1), fontWeight: 900 }} />;
}

function OrderRow({ order, onClick }) {
  return (
    <Box onClick={onClick} sx={{ p: 1.6, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1.5}>
        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Typography fontWeight="900">Заказ #{order.id}</Typography>
            <StatusChip status={order.status} />
          </Stack>
          <Typography variant="body2" color="text.secondary" noWrap>
            {order.customer_name} · {order.customer_phone} · {formatDate(order.created_at)}
          </Typography>
        </Box>
        <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
          <Typography fontWeight="900">{formatMoney(order.total_amount)}</Typography>
          <Typography variant="caption" color="text.secondary">Маржа: {formatMoney(order.profit_amount)}</Typography>
        </Box>
      </Stack>
    </Box>
  );
}

function OrdersPage({ orders, selectedOrder, setSelectedOrder, filters, setFilters, onStatusChange }) {
  return (
    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: '420px minmax(0, 1fr)' }, alignItems: 'start' }}>
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 2, display: 'grid', gap: 1.2, gridTemplateColumns: { xs: '1fr', sm: '1fr 180px', lg: '1fr' } }}>
          <TextField
            size="small"
            placeholder="Номер, телефон, артикул"
            value={filters.search}
            onChange={(event) => setFilters({ ...filters, search: event.target.value })}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
          />
          <TextField
            select
            size="small"
            label="Статус"
            value={filters.status}
            onChange={(event) => setFilters({ ...filters, status: event.target.value })}
          >
            <MenuItem value="">Все</MenuItem>
            {statuses.map((status) => <MenuItem key={status} value={status}>{statusLabels[status]}</MenuItem>)}
          </TextField>
        </Box>
        <Divider />
        <Stack divider={<Divider />}>
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} onClick={() => setSelectedOrder(order)} />
          ))}
        </Stack>
      </Paper>

      <OrderDetails order={selectedOrder || orders[0]} onStatusChange={onStatusChange} />
    </Box>
  );
}

function OrderDetails({ order, onStatusChange }) {
  if (!order) {
    return (
      <Paper elevation={0} sx={{ p: 4, border: '1px dashed', borderColor: 'divider', borderRadius: 2, textAlign: 'center' }}>
        <ReceiptLong sx={{ fontSize: 52, color: 'text.disabled' }} />
        <Typography color="text.secondary">Выберите заказ</Typography>
      </Paper>
    );
  }
  return (
    <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, minWidth: 0 }}>
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
          <Box>
            <Typography variant="h6" fontWeight="900">Заказ #{order.id}</Typography>
            <Typography variant="body2" color="text.secondary">{formatDate(order.created_at)}</Typography>
          </Box>
          <TextField select size="small" label="Статус" value={order.status} onChange={(event) => onStatusChange(order.id, event.target.value)} sx={{ minWidth: 190 }}>
            {statuses.map((status) => <MenuItem key={status} value={status}>{statusLabels[status]}</MenuItem>)}
          </TextField>
        </Stack>

        <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          <TextField label="Покупатель" size="small" value={order.customer_name || ''} InputProps={{ readOnly: true }} />
          <TextField label="Телефон" size="small" value={order.customer_phone || ''} InputProps={{ readOnly: true }} />
          <TextField label="Адрес" size="small" value={order.delivery_address || ''} InputProps={{ readOnly: true }} sx={{ gridColumn: { xs: 'auto', sm: '1 / -1' } }} />
        </Box>

        <Divider />
        <Stack spacing={1.2}>
          {(order.items || []).map((item) => (
            <Box key={item.id} sx={{ display: 'grid', gridTemplateColumns: '72px minmax(0, 1fr) auto', gap: 1.5, p: 1.2, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, alignItems: 'center' }}>
              <Box sx={{ width: 72, height: 72, borderRadius: 1.2, border: '1px solid', borderColor: 'divider', display: 'grid', placeItems: 'center', overflow: 'hidden', bgcolor: 'action.hover' }}>
                {item.image ? <Box component="img" src={item.image} alt={item.name} sx={{ width: '100%', height: '100%', objectFit: 'contain', p: 0.5 }} /> : <Inventory2 color="disabled" />}
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography fontWeight="900" sx={{ wordBreak: 'break-word' }}>{item.brand} {item.article}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>{item.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.supplier} · Артикул поставщика: <Box component="span" sx={{ color: 'text.primary', fontWeight: 800 }}>{item.supplier_article || 'не указан'}</Box>
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography fontWeight="900">{formatMoney(item.total)}</Typography>
                <Typography variant="caption" color="text.secondary">{item.quantity} x {formatMoney(item.price)}</Typography>
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h6" fontWeight="900">Итого</Typography>
          <Typography variant="h6" fontWeight="900" color="primary">{formatMoney(order.total_amount)}</Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

function UsersPage({ users, selectedUser, setSelectedUser, search, setSearch }) {
  return (
    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: '420px minmax(0, 1fr)' }, alignItems: 'start' }}>
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 2 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="ФИО, телефон, email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
          />
        </Box>
        <Divider />
        <Stack divider={<Divider />}>
          {users.map((user) => (
            <Box key={user.id} onClick={() => setSelectedUser(user)} sx={{ p: 1.6, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
              <Typography fontWeight="900">{user.full_name || `Пользователь #${user.id}`}</Typography>
              <Typography variant="body2" color="text.secondary">{user.phone || user.email || 'контакты не указаны'}</Typography>
              <Typography variant="caption" color="text.secondary">{user.orders_count} заказов · {formatMoney(user.orders_sum)}</Typography>
            </Box>
          ))}
        </Stack>
      </Paper>
      <UserDetails user={selectedUser || users[0]} />
    </Box>
  );
}

function UserDetails({ user }) {
  if (!user) {
    return <Paper elevation={0} sx={{ p: 4, border: '1px dashed', borderColor: 'divider', borderRadius: 2, textAlign: 'center' }}>Выберите пользователя</Paper>;
  }
  return (
    <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h6" fontWeight="900">{user.full_name || `Пользователь #${user.id}`}</Typography>
          <Typography variant="body2" color="text.secondary">Создан: {formatDate(user.created_at)}</Typography>
        </Box>
        <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          <TextField label="Телефон" size="small" value={user.phone || ''} InputProps={{ readOnly: true }} />
          <TextField label="Email" size="small" value={user.email || ''} InputProps={{ readOnly: true }} />
          <TextField label="Адрес доставки" size="small" value={user.delivery_address || ''} InputProps={{ readOnly: true }} sx={{ gridColumn: { xs: 'auto', sm: '1 / -1' } }} />
        </Box>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          <StatCard label="Заказы клиента" value={user.orders_count || 0} icon={<ReceiptLong />} color="#005387" />
          <StatCard label="Сумма заказов" value={formatMoney(user.orders_sum)} icon={<Paid />} color="#20843d" />
        </Box>
        <Divider />
        <Typography fontWeight="900">Заказы пользователя</Typography>
        <Stack spacing={1}>
          {(user.orders || []).map((order) => (
            <Card key={order.id} variant="outlined" sx={{ borderRadius: 1.5 }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography fontWeight="900">Заказ #{order.id}</Typography>
                    <Typography variant="caption" color="text.secondary">{formatDate(order.created_at)}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <StatusChip status={order.status} />
                    <Typography fontWeight="900" sx={{ mt: 0.5 }}>{formatMoney(order.total_amount)}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}

function PaymentsPage({ providers, settings }) {
  return (
    <Stack spacing={2}>
      <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="900">Платежные системы</Typography>
        <Typography variant="body2" color="text.secondary">Заготовки для будущей интеграции оплат и транзакций.</Typography>
      </Paper>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' } }}>
        {providers.map((provider) => (
          <Paper key={provider.id} elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight="900">{provider.name}</Typography>
              <Chip size="small" label={provider.status} />
            </Stack>
            <Button sx={{ mt: 2 }} startIcon={<Settings />} variant="outlined" disabled>Настройки</Button>
          </Paper>
        ))}
      </Box>
      <Alert severity="info">Статусы платежей: {(settings.statuses || []).join(', ')}</Alert>
    </Stack>
  );
}

function AppContent() {
  const [admin, setAdmin] = useState(null);
  const [active, setActive] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [paymentSettings, setPaymentSettings] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [orderFilters, setOrderFilters] = useState({ status: '', search: '' });
  const [userSearch, setUserSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setSyncing(true);
    setError('');
    try {
      const [statsData, ordersData, usersData, providerData, settingsData] = await Promise.all([
        api.stats(),
        api.orders(orderFilters),
        api.users(userSearch),
        api.paymentProviders(),
        api.paymentSettings(),
      ]);
      setStats(statsData);
      setOrders(ordersData);
      setUsers(usersData);
      setProviders(providerData);
      setPaymentSettings(settingsData);
      setSelectedOrder((current) => ordersData.find((order) => order.id === current?.id) || ordersData[0] || null);
      setSelectedUser((current) => usersData.find((user) => user.id === current?.id) || usersData[0] || null);
    } catch (err) {
      if (err.status === 401) {
        localStorage.removeItem('adminToken');
        setAdmin(null);
        return;
      }
      setError(err.message || 'Не удалось загрузить админку');
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, [orderFilters, userSearch]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setLoading(false);
      return;
    }
    api.me().then(setAdmin).catch(() => {
      localStorage.removeItem('adminToken');
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (admin) loadData();
  }, [admin, loadData]);

  useEffect(() => {
    if (!admin) return undefined;
    const handle = window.setTimeout(() => loadData({ silent: true }), 350);
    return () => window.clearTimeout(handle);
  }, [admin, orderFilters.status, orderFilters.search, userSearch, loadData]);

  useEffect(() => {
    if (!admin) return undefined;
    const interval = window.setInterval(() => loadData({ silent: true }), 10000);
    return () => window.clearInterval(interval);
  }, [admin, loadData]);

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  const handleStatusChange = async (orderId, status) => {
    const updated = await api.updateOrderStatus(orderId, status);
    setSelectedOrder(updated);
    await loadData({ silent: true });
  };

  if (!admin && !loading) return <LoginScreen onLogin={setAdmin} />;
  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: 'background.default' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Shell active={active} setActive={setActive} admin={admin} onLogout={logout} onRefresh={() => loadData({ silent: true })} syncing={syncing}>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
        {active === 'dashboard' && <DashboardPage stats={stats} setActive={setActive} setSelectedOrder={setSelectedOrder} />}
        {active === 'orders' && (
          <OrdersPage
            orders={orders}
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
            filters={orderFilters}
            setFilters={setOrderFilters}
            onStatusChange={handleStatusChange}
          />
        )}
        {active === 'users' && (
          <UsersPage
            users={users}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            search={userSearch}
            setSearch={setUserSearch}
          />
        )}
        {active === 'payments' && <PaymentsPage providers={providers} settings={paymentSettings} />}
      </Stack>
    </Shell>
  );
}

function App() {
  const theme = useMemo(() => createTheme({
    palette: {
      mode: 'light',
      primary: { main: '#005387', 50: '#e8f3fb' },
      background: { default: '#f4f7f9', paper: '#ffffff' },
    },
    typography: { fontFamily: '"Inter", "Roboto", sans-serif' },
    shape: { borderRadius: 10 },
  }), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
