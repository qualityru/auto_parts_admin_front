export const formatMoney = (value) => `${Number(value || 0).toLocaleString('ru-RU')} ₽`;

export const formatDate = (value) => (value ? new Date(value).toLocaleString('ru-RU') : '');
