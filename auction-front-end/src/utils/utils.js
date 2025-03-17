export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', { hour12: false });
};
