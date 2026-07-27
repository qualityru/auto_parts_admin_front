import { Box, Divider, Stack, Typography } from '@mui/material';
import { Group, Paid, ReceiptLong, ShoppingCart } from '@mui/icons-material';
import SectionPaper from '../components/common/SectionPaper';
import EmptyState from '../components/common/EmptyState';
import StatCard from '../components/dashboard/StatCard';
import OrderRow from '../components/orders/OrderRow';
import { formatMoney } from '../utils/formatters';

export default function DashboardPage({ stats, onOpenOrder }) {
  const recentOrders = stats.recent_orders || [];
  return <Stack spacing={3}><Box><Typography variant="h5">Обзор</Typography><Typography color="text.secondary">Ключевые показатели и последние изменения</Typography></Box><Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' } }}><StatCard label="Всего заказов" value={stats.orders_count || 0} icon={<ShoppingCart />} /><StatCard label="Сумма заказов" value={formatMoney(stats.orders_amount)} color="info.main" icon={<ReceiptLong />} /><StatCard label={`Маржа ${stats.markup_part || 30}%`} value={formatMoney(stats.profit_amount)} color="success.main" icon={<Paid />} /><StatCard label="Пользователи" value={stats.users_count || 0} color="warning.main" icon={<Group />} /></Box><SectionPaper sx={{ overflow: 'hidden' }}><Box sx={{ p: 2.25, borderBottom: '1px solid', borderColor: 'divider' }}><Typography variant="h6">Последние заказы</Typography></Box>{recentOrders.length ? <Stack divider={<Divider />} >{recentOrders.map((order) => <OrderRow key={order.id} order={order} onClick={() => onOpenOrder(order)} />)}</Stack> : <EmptyState icon={<ReceiptLong fontSize="large" />} title="Заказов пока нет" />}</SectionPaper></Stack>;
}
