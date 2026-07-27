import { useState } from 'react';
import { Box, Button, CircularProgress, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Stack, Toolbar, Typography } from '@mui/material';
import { Dashboard, Logout, Menu, Paid, People, ReceiptLong, Refresh, Storefront } from '@mui/icons-material';

const navigation = [
  { id: 'dashboard', label: 'Обзор', icon: <Dashboard /> },
  { id: 'orders', label: 'Заказы', icon: <ReceiptLong /> },
  { id: 'users', label: 'Пользователи', icon: <People /> },
  { id: 'payments', label: 'Платежи', icon: <Paid /> },
];
const drawerWidth = 272;

function Brand() { return <Stack direction="row" spacing={1.25} alignItems="center" sx={{ px: 2.25, py: 2.5 }}><Box sx={{ display: 'grid', placeItems: 'center', width: 40, height: 40, bgcolor: 'primary.main', color: '#fff', borderRadius: 2 }}><Storefront /></Box><Box><Typography fontWeight={800}>Auto Parts</Typography><Typography variant="caption" color="text.secondary">Центр управления</Typography></Box></Stack>; }
function Navigation({ active, onChange }) { return <List sx={{ px: 1.25 }}>{navigation.map((item) => <ListItemButton key={item.id} selected={item.id === active} onClick={() => onChange(item.id)} sx={{ borderRadius: 2, mb: .5, '&.Mui-selected': { bgcolor: 'primary.light', color: 'primary.dark' }, '&.Mui-selected:hover': { bgcolor: 'primary.light' } }}><ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{item.icon}</ListItemIcon><ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: item.id === active ? 800 : 600 }} /></ListItemButton>)}</List>; }

export default function AdminLayout({ active, setActive, admin, onLogout, onRefresh, syncing, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const selectTab = (tab) => { setActive(tab); setMobileOpen(false); };
  const drawer = <><Brand /><Navigation active={active} onChange={selectTab} /></>;
  return <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex' }}>
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}><Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}>{drawer}</Drawer><Drawer variant="permanent" sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth, borderRight: '1px solid', borderColor: 'divider', boxSizing: 'border-box' } }} open>{drawer}</Drawer></Box>
    <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}><Toolbar sx={{ minHeight: '76px !important', px: { xs: 2, md: 4 }, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', justifyContent: 'space-between' }}><Stack direction="row" spacing={1} alignItems="center"><IconButton onClick={() => setMobileOpen(true)} sx={{ display: { md: 'none' } }}><Menu /></IconButton><Box><Typography variant="h5">Панель управления</Typography><Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>Администратор: {admin?.login || ''}</Typography></Box></Stack><Stack direction="row" spacing={1}><IconButton aria-label="Обновить данные" onClick={onRefresh} disabled={syncing}>{syncing ? <CircularProgress size={20} /> : <Refresh />}</IconButton><Button color="inherit" startIcon={<Logout />} onClick={onLogout} sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>Выйти</Button></Stack></Toolbar><Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1600, mx: 'auto' }}>{children}</Box></Box>
  </Box>;
}
