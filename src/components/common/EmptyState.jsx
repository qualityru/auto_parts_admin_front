import { Box, Typography } from '@mui/material';

export default function EmptyState({ icon, title = 'Нет данных', description, sx }) {
  return (
    <Box sx={{ p: 5, textAlign: 'center', color: 'text.secondary', ...sx }}>
      <Box sx={{ mb: 1, color: 'text.disabled' }}>{icon}</Box>
      <Typography fontWeight={700} color="text.primary">{title}</Typography>
      {description && <Typography variant="body2">{description}</Typography>}
    </Box>
  );
}
