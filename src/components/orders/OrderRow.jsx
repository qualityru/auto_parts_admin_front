import { Box, Stack, Typography } from '@mui/material';
import StatusChip from './StatusChip';
import { formatDate, formatMoney } from '../../utils/formatters';

export default function OrderRow({ order, onClick }) {
  return <Box onClick={onClick} sx={{ p: 1.75, cursor: onClick ? 'pointer' : 'default', '&:hover': onClick ? { bgcolor: 'action.hover' } : undefined }}>
    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1.5}>
      <Box sx={{ minWidth: 0 }}><Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap"><Typography fontWeight={800}>Заказ #{order.id}</Typography><StatusChip status={order.status} /></Stack><Typography variant="body2" color="text.secondary" noWrap>{order.customer_name} · {order.customer_phone} · {formatDate(order.created_at)}</Typography></Box>
      <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}><Typography fontWeight={800}>{formatMoney(order.total_amount)}</Typography><Typography variant="caption" color="text.secondary">Маржа: {formatMoney(order.profit_amount)}</Typography></Box>
    </Stack>
  </Box>;
}
