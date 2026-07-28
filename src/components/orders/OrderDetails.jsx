import { Box, Divider, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { Inventory2 } from '@mui/icons-material';
import StatusChip from './StatusChip';
import { orderStatuses, statusLabels } from '../../constants/orders';
import { formatDate, formatMoney } from '../../utils/formatters';

const ReadonlyField = ({ label, value, sx }) => <TextField label={label} size="small" value={value || '—'} InputProps={{ readOnly: true }} sx={sx} />;

function OrderItemDetails({ item }) {
  const delivery = item.delivery_date || item.delivery_term || 'не указано поставщиком';
  return <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '64px minmax(0, 1fr) auto' }, gap: 1.5, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, alignItems: 'center' }}>
    <Box sx={{ width: 64, height: 64, display: 'grid', placeItems: 'center', borderRadius: 1.5, bgcolor: 'action.hover', overflow: 'hidden' }}>{item.image ? <Box component="img" src={item.image} alt={item.name} sx={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <Inventory2 color="disabled" />}</Box>
    <Box sx={{ minWidth: 0 }}><Typography fontWeight={800}>{item.brand} {item.article}</Typography><Typography variant="body2">{item.name}</Typography><Typography variant="body2" color="text.secondary">Поставщик: {item.supplier} · Склад: {item.warehouse_name || 'не указан'}</Typography><Typography variant="caption" color="text.secondary">Артикул поставщика: {item.supplier_article || 'не указан'} · Прибытие/срок: {delivery}</Typography></Box>
    <Box textAlign={{ sm: 'right' }}><Typography fontWeight={800}>{formatMoney(item.total)}</Typography><Typography variant="body2" color="text.secondary">{item.quantity} шт. × {formatMoney(item.price)}</Typography></Box>
    <Box sx={{ gridColumn: { sm: '2 / -1' }, display: 'flex', flexWrap: 'wrap', gap: 1.5 }}><Typography variant="caption" color="text.secondary">ID товара: {item.product_id}</Typography><Typography variant="caption" color="text.secondary">ID склада: {item.warehouse_id}</Typography><Typography variant="caption" color="text.secondary">Возврат: {item.return_type || 'не указан'}</Typography><Typography variant="caption" color="text.secondary">Риск отказа: {item.fail_percent ? `${item.fail_percent}%` : 'не указан'}</Typography><Typography variant="caption" color="text.secondary">Добавлен: {formatDate(item.created_at)}</Typography><Typography variant="caption" color="text.secondary">Обновлён: {formatDate(item.updated_at)}</Typography></Box>
  </Box>;
}

export default function OrderDetails({ order, onStatusChange }) {
  if (!order) return null;
  return <Stack spacing={2.25}>
    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}><Box><Typography variant="h6">Заказ #{order.id}</Typography><Typography variant="body2" color="text.secondary">Оформлен: {formatDate(order.created_at)} (МСК)</Typography><Typography variant="caption" color="text.secondary">Обновлён: {formatDate(order.updated_at)} (МСК) · Клиент ID: {order.user_id}</Typography></Box>{onStatusChange ? <TextField select label="Статус" size="small" value={order.status} onChange={(event) => onStatusChange(order.id, event.target.value)} sx={{ minWidth: 190 }}>{orderStatuses.map((status) => <MenuItem key={status} value={status}>{statusLabels[status]}</MenuItem>)}</TextField> : <StatusChip status={order.status} />}</Stack>
    <Box sx={{ display: 'grid', gap: 1.25, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}><ReadonlyField label="Покупатель" value={order.customer_name} /><ReadonlyField label="Телефон" value={order.customer_phone} /><ReadonlyField label="Адрес доставки" value={order.delivery_address} sx={{ gridColumn: { sm: '1 / -1' } }} />{order.comment && <ReadonlyField label="Комментарий клиента" value={order.comment} sx={{ gridColumn: { sm: '1 / -1' } }} />}</Box>
    <Typography variant="body2" color="text.secondary">Валюта: {order.currency} · Маржа: {formatMoney(order.profit_amount)}</Typography>
    <Divider /><Typography fontWeight={800}>Состав заказа</Typography><Stack spacing={1.25}>{(order.items || []).map((item) => <OrderItemDetails key={item.id} item={item} />)}</Stack>
    <Stack direction="row" justifyContent="space-between"><Typography variant="h6">Итого</Typography><Typography variant="h6" color="primary">{formatMoney(order.total_amount)}</Typography></Stack>
  </Stack>;
}
