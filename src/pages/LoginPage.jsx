import { useState } from 'react';
import { Alert, Box, Button, CircularProgress, Paper, Stack, TextField, Typography } from '@mui/material';
import { Storefront } from '@mui/icons-material';
import { api } from '../api';

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ login: '', password: '' }); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const submit = async (event) => { event.preventDefault(); setError(''); setLoading(true); try { const data = await api.login(form); localStorage.setItem('adminToken', data.access_token); onLogin(data.admin); } catch (err) { setError(err.message || 'Не удалось войти'); } finally { setLoading(false); } };
  return <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2, bgcolor: 'background.default' }}><Paper elevation={0} sx={{ width: '100%', maxWidth: 430, p: { xs: 3, sm: 4 }, border: '1px solid', borderColor: 'divider' }}><Stack component="form" spacing={2.25} onSubmit={submit}><Stack direction="row" spacing={1.5} alignItems="center"><Box sx={{ width: 46, height: 46, display: 'grid', placeItems: 'center', bgcolor: 'primary.main', color: '#fff', borderRadius: 2 }}><Storefront /></Box><Box><Typography variant="h5">Админка запчастей</Typography><Typography variant="body2" color="text.secondary">Управление заказами и клиентами</Typography></Box></Stack>{error && <Alert severity="error">{error}</Alert>}<TextField label="Логин" value={form.login} autoFocus onChange={(event) => setForm({ ...form, login: event.target.value })} /><TextField label="Пароль" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /><Button type="submit" variant="contained" size="large" disabled={loading}>{loading ? <CircularProgress color="inherit" size={22} /> : 'Войти'}</Button></Stack></Paper></Box>;
}
