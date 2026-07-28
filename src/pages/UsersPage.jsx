import { useEffect, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, CircularProgress, Divider, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { Edit, Paid, People, ReceiptLong, Search } from '@mui/icons-material';
import SectionPaper from '../components/common/SectionPaper';
import EmptyState from '../components/common/EmptyState';
import StatCard from '../components/dashboard/StatCard';
import StatusChip from '../components/orders/StatusChip';
import { formatDate, formatMoney } from '../utils/formatters';

const profileFields = ['last_name', 'first_name', 'middle_name', 'phone', 'delivery_address'];
const profileFromUser = (user) => profileFields.reduce((profile, field) => ({ ...profile, [field]: user?.[field] || '' }), {});

function UserDetails({ user, onUserUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => profileFromUser(user));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!editing) setForm(profileFromUser(user));
  }, [user, editing]);

  if (!user) return <SectionPaper><EmptyState icon={<People fontSize="large" />} title="Выберите пользователя" /></SectionPaper>;

  const change = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const cancel = () => { setForm(profileFromUser(user)); setError(''); setEditing(false); };
  const save = async () => {
    setSaving(true);
    setError('');
    try {
      await onUserUpdate(user.id, form);
      setEditing(false);
    } catch (err) {
      setError(err.message || 'Не удалось сохранить данные клиента');
    } finally {
      setSaving(false);
    }
  };

  return <SectionPaper sx={{ p: { xs: 2, sm: 2.5 } }}><Stack spacing={2.25}>
    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1} alignItems={{ sm: 'center' }}>
      <Box><Typography variant="h6">{user.full_name || `Пользователь #${user.id}`}</Typography><Typography variant="body2" color="text.secondary">Создан: {formatDate(user.created_at)}</Typography></Box>
      {!editing && <Button variant="outlined" startIcon={<Edit />} onClick={() => setEditing(true)}>Редактировать</Button>}
    </Stack>
    {error && <Alert severity="error">{error}</Alert>}
    <Box sx={{ display: 'grid', gap: 1.25, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
      <TextField label="Фамилия" size="small" value={editing ? form.last_name : user.last_name || ''} onChange={change('last_name')} required disabled={!editing} />
      <TextField label="Имя" size="small" value={editing ? form.first_name : user.first_name || ''} onChange={change('first_name')} required disabled={!editing} />
      <TextField label="Отчество" size="small" value={editing ? form.middle_name : user.middle_name || ''} onChange={change('middle_name')} disabled={!editing} />
      <TextField label="Телефон" size="small" value={editing ? form.phone : user.phone || ''} onChange={change('phone')} required disabled={!editing} />
      <TextField label="Email" size="small" value={user.email || ''} InputProps={{ readOnly: true }} />
      <TextField label="Адрес доставки" size="small" value={editing ? form.delivery_address : user.delivery_address || ''} onChange={change('delivery_address')} required disabled={!editing} sx={{ gridColumn: { sm: '1 / -1' } }} />
    </Box>
    {editing && <Stack direction="row" justifyContent="flex-end" spacing={1}><Button onClick={cancel} disabled={saving}>Отмена</Button><Button variant="contained" onClick={save} disabled={saving}>{saving ? <CircularProgress color="inherit" size={22} /> : 'Сохранить'}</Button></Stack>}
    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}><StatCard label="Заказы клиента" value={user.orders_count || 0} icon={<ReceiptLong />} /><StatCard label="Сумма заказов" value={formatMoney(user.orders_sum)} icon={<Paid />} color="success.main" /></Box>
    <Divider /><Typography fontWeight={800}>Заказы пользователя</Typography>
    {(user.orders || []).length ? <Stack spacing={1}>{user.orders.map((order) => <Card variant="outlined" key={order.id}><CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}><Stack direction="row" justifyContent="space-between"><Box><Typography fontWeight={800}>Заказ #{order.id}</Typography><Typography variant="caption" color="text.secondary">{formatDate(order.created_at)}</Typography></Box><Box textAlign="right"><StatusChip status={order.status} /><Typography fontWeight={800} sx={{ mt: .5 }}>{formatMoney(order.total_amount)}</Typography></Box></Stack></CardContent></Card>)}</Stack> : <EmptyState title="У пользователя пока нет заказов" sx={{ py: 3 }} />}
  </Stack></SectionPaper>;
}

export default function UsersPage({ users, selectedUser, setSelectedUser, search, setSearch, onUserUpdate }) {
  return <Stack spacing={3}><Box><Typography variant="h5">Пользователи</Typography><Typography color="text.secondary">Профили клиентов и история покупок</Typography></Box><Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: '400px minmax(0, 1fr)' }, alignItems: 'start' }}><SectionPaper sx={{ overflow: 'hidden' }}><Box sx={{ p: 2 }}><TextField size="small" fullWidth placeholder="ФИО, телефон, email" value={search} onChange={(event) => setSearch(event.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }} /></Box><Divider />{users.length ? <Stack divider={<Divider />}>{users.map((user) => <Box key={user.id} onClick={() => setSelectedUser(user)} sx={{ p: 1.75, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}><Typography fontWeight={800}>{user.full_name || `Пользователь #${user.id}`}</Typography><Typography variant="body2" color="text.secondary">{user.phone || user.email || 'Контакты не указаны'}</Typography><Typography variant="caption" color="text.secondary">{user.orders_count} заказов · {formatMoney(user.orders_sum)}</Typography></Box>)}</Stack> : <EmptyState icon={<People fontSize="large" />} title="Пользователи не найдены" />}</SectionPaper><UserDetails user={selectedUser || users[0]} onUserUpdate={onUserUpdate} /></Box></Stack>;
}
