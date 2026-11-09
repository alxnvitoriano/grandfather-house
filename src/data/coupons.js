// Lista fixa de cupons no frontend. Em produção a validação deve migrar para o backend.
export const coupons = [
    { code: 'NATAL10', type: 'percent', value: 10, label: '10% de desconto' },
    { code: 'BEMVINDO15', type: 'percent', value: 15, label: '15% de desconto' },
    { code: 'FRETE20', type: 'fixed', value: 20, label: 'R$ 20 de desconto' },
];

export const findCoupon = (code) =>
    coupons.find((coupon) => coupon.code === String(code).trim().toUpperCase()) ?? null;

export const calculateDiscount = (coupon, subtotal) => {
    if (!coupon) return 0;
    if (coupon.type === 'percent') return (subtotal * coupon.value) / 100;
    return Math.min(coupon.value, subtotal);
};
