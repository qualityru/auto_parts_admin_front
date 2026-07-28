import { useCallback, useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, CssBaseline, Snackbar, Stack } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { api } from './api';
import { theme } from './theme';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import OrdersPage from './pages/OrdersPage';
import UsersPage from './pages/UsersPage';
import PaymentsPage from './pages/PaymentsPage';

function AppContent() {
  const [admin, setAdmin] = useState(null); const [active, setActive] = useState('dashboard'); const [stats, setStats] = useState({}); const [orders, setOrders] = useState([]); const [users, setUsers] = useState([]); const [providers, setProviders] = useState([]); const [paymentSettings, setPaymentSettings] = useState({}); const [selectedOrder, setSelectedOrder] = useState(null); const [selectedUser, setSelectedUser] = useState(null); const [orderFilters, setOrderFilters] = useState({ status: '', search: '' }); const [userFilters, setUserFilters] = useState({ search: '', enabled: '', hasOrders: '' }); const [loading, setLoading] = useState(true); const [syncing, setSyncing] = useState(false); const [error, setError] = useState(''); const [notice, setNotice] = useState('');
  const loadData = useCallback(async ({ silent = false } = {}) => { if (!silent) setLoading(true); setSyncing(true); setError(''); try { const [statsData, ordersData, usersData, providerData, settingsData] = await Promise.all([api.stats(), api.orders(orderFilters), api.users(userFilters), api.paymentProviders(), api.paymentSettings()]); setStats(statsData); setOrders(ordersData); setUsers(usersData); setProviders(providerData); setPaymentSettings(settingsData); setSelectedOrder((current) => ordersData.find((order) => order.id === current?.id) || ordersData[0] || null); setSelectedUser((current) => { const listed = usersData.find((user) => user.id === current?.id) || usersData[0] || null; return current && listed && current.id === listed.id && Array.isArray(current.orders) ? { ...listed, ...current } : listed; }); } catch (err) { if (err.status === 401) { localStorage.removeItem('adminToken'); setAdmin(null); return; } setError(err.message || 'Не удалось загрузить админку'); } finally { setLoading(false); setSyncing(false); } }, [orderFilters, userFilters]);
  useEffect(() => { if (!localStorage.getItem('adminToken')) { setLoading(false); return; } api.me().then(setAdmin).catch(() => { localStorage.removeItem('adminToken'); setLoading(false); }); }, []);
  useEffect(() => { if (admin) loadData(); }, [admin, loadData]);
  useEffect(() => { if (!admin) return undefined; const handle = window.setTimeout(() => loadData({ silent: true }), 350); return () => window.clearTimeout(handle); }, [admin, orderFilters.status, orderFilters.search, userFilters.search, userFilters.enabled, userFilters.hasOrders, loadData]);
  useEffect(() => { if (!admin) return undefined; const interval = window.setInterval(() => loadData({ silent: true }), 10000); return () => window.clearInterval(interval); }, [admin, loadData]);
  const logout = () => { localStorage.removeItem('adminToken'); setAdmin(null); };
  const handleStatusChange = async (orderId, status) => { try { const updated = await api.updateOrderStatus(orderId, status); setSelectedOrder(updated); await loadData({ silent: true }); setNotice('Статус заказа обновлён'); } catch (err) { setError(err.message || 'Не удалось обновить статус'); } };
  const handleUserSelect = useCallback(async (user) => { setSelectedUser(user); if (Array.isArray(user.orders)) return; try { const detailed = await api.user(user.id); setUsers((current) => current.map((item) => item.id === user.id ? { ...item, ...detailed } : item)); setSelectedUser((current) => current?.id === user.id ? detailed : current); } catch (err) { setError(err.message || 'Не удалось загрузить данные клиента'); } }, []);
  const handleUserUpdate = async (userId, payload) => { const updated = await api.updateUser(userId, payload); setUsers((current) => current.map((user) => user.id === userId ? { ...user, ...updated } : user)); setSelectedUser(updated); setNotice('Данные клиента сохранены'); return updated; };
  if (!admin && !loading) return <LoginPage onLogin={setAdmin} />;
  if (loading) return <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>;
  const openOrder = (order) => { setSelectedOrder(order); setActive('orders'); };
  return <AdminLayout active={active} setActive={setActive} admin={admin} onLogout={logout} onRefresh={() => loadData({ silent: true })} syncing={syncing}><Stack spacing={2}>{error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}{active === 'dashboard' && <DashboardPage stats={stats} onOpenOrder={openOrder} />}{active === 'orders' && <OrdersPage orders={orders} selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} filters={orderFilters} setFilters={setOrderFilters} onStatusChange={handleStatusChange} />}{active === 'users' && <UsersPage users={users} selectedUser={selectedUser} setSelectedUser={handleUserSelect} filters={userFilters} setFilters={setUserFilters} onUserUpdate={handleUserUpdate} />}{active === 'payments' && <PaymentsPage providers={providers} settings={paymentSettings} />}</Stack><Snackbar open={Boolean(notice)} autoHideDuration={3000} onClose={() => setNotice('')} message={notice} /></AdminLayout>;
}
export default function App() { return <ThemeProvider theme={theme}><CssBaseline /><AppContent /></ThemeProvider>; }
