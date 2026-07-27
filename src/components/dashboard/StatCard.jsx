import { Box, Typography, alpha } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SectionPaper from '../common/SectionPaper';

export default function StatCard({ label, value, icon, color = 'primary.main' }) {
  const theme = useTheme();
  const resolvedColor = color.includes('.') ? color.split('.').reduce((value, key) => value?.[key], theme.palette) : color;
  return <SectionPaper sx={{ p: 2.25, minWidth: 0 }}><Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}><Box sx={{ width: 44, height: 44, borderRadius: 2, display: 'grid', placeItems: 'center', color: resolvedColor, bgcolor: alpha(resolvedColor, 0.1) }}>{icon}</Box><Box sx={{ minWidth: 0 }}><Typography variant="caption" color="text.secondary" fontWeight={700}>{label}</Typography><Typography variant="h6" noWrap>{value}</Typography></Box></Box></SectionPaper>;
}
