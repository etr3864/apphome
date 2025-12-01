export const formatCurrency = (amount: number, currency = '₪'): string => {
  return `${currency} ${amount.toLocaleString('he-IL')}`;
};

export const formatDate = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' });
};

export const formatDateFull = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('he-IL', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });
};

