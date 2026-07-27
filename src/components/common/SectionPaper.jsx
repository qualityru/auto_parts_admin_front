import { Paper } from '@mui/material';

export default function SectionPaper({ children, sx, ...props }) {
  return <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', ...sx }} {...props}>{children}</Paper>;
}
