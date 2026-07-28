export const formatMoney = (value) => `${Number(value || 0).toLocaleString('ru-RU')} ₽`;

export const formatDate = (value) => (value ? new Intl.DateTimeFormat('ru-RU', {
  timeZone: 'Europe/Moscow',
  dateStyle: 'medium',
  timeStyle: 'medium',
  hour12: false,
}).format(new Date(value)) : '');
