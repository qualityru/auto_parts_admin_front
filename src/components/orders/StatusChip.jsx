import { Chip, alpha } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { statusLabels } from '../../constants/orders';

export default function StatusChip({ status }) {
  const theme = useTheme();
  const color = {
    created: theme.palette.info.main, confirmed: theme.palette.primary.main,
    processing: theme.palette.warning.main, shipped: theme.palette.secondary.main,
    delivered: theme.palette.success.main, cancelled: theme.palette.error.main,
  }[status] || theme.palette.text.secondary;
  return <Chip size="small" label={statusLabels[status] || status} sx={{ color, bgcolor: alpha(color, 0.1), fontWeight: 800 }} />;
}
