import { Box, Divider, InputAdornment, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { ReceiptLong, Search } from '@mui/icons-material';
import SectionPaper from '../components/common/SectionPaper';
import EmptyState from '../components/common/EmptyState';
import OrderRow from '../components/orders/OrderRow';
import OrderDetails from '../components/orders/OrderDetails';
import { orderStatuses, statusLabels } from '../constants/orders';

export default function OrdersPage({ orders, selectedOrder, setSelectedOrder, filters, setFilters, onStatusChange }) {
  const order = selectedOrder || orders[0];
  return <Stack spacing={3}><Box><Typography variant="h5">Заказы</Typography><Typography color="text.secondary">Поиск, статусы, сроки поставки и состав заказов</Typography></Box><Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: '400px minmax(0, 1fr)' }, alignItems: 'start' }}><SectionPaper sx={{ overflow: 'hidden' }}><Box sx={{ p: 2, display: 'grid', gap: 1.25 }}><TextField size="small" placeholder="Номер, телефон, артикул" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }} /><TextField select size="small" label="Статус" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}><MenuItem value="">Все статусы</MenuItem>{orderStatuses.map((status) => <MenuItem key={status} value={status}>{statusLabels[status]}</MenuItem>)}</TextField></Box><Divider />{orders.length ? <Stack divider={<Divider />}>{orders.map((item) => <OrderRow key={item.id} order={item} onClick={() => setSelectedOrder(item)} />)}</Stack> : <EmptyState icon={<ReceiptLong fontSize="large" />} title="Заказы не найдены" />}</SectionPaper><SectionPaper sx={{ p: { xs: 2, sm: 2.5 } }}>{order ? <OrderDetails order={order} onStatusChange={onStatusChange} /> : <EmptyState icon={<ReceiptLong fontSize="large" />} title="Выберите заказ" />}</SectionPaper></Box></Stack>;
}
