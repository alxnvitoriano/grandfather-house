// Cálculo autoritativo de preços no servidor. O frontend usa regras
// equivalentes apenas para exibir a prévia; o valor cobrado é sempre
// recalculado aqui a partir do carrinho salvo no banco.

export const FREE_SHIPPING_THRESHOLD = 249.9;
export const SHIPPING_FEE = 19.9;

// Mesma tabela de src/data/coupons.js. Fonte da verdade é aqui: o front apenas
// sugere o desconto, o valor final vem deste módulo.
export const coupons = [
    { code: 'NATAL10', type: 'percent', value: 10, label: '10% de desconto' },
    { code: 'BEMVINDO15', type: 'percent', value: 15, label: '15% de desconto' },
    { code: 'FRETE20', type: 'fixed', value: 20, label: 'R$ 20 de desconto' },
];

// Preços chegam como "R$ 349,90"; converte para 349.9.
export const parsePrice = (price) =>
    Number(String(price).replace(/[^\d,]/g, '').replace(',', '.'));

export const findCoupon = (code) =>
    coupons.find((coupon) => coupon.code === String(code ?? '').trim().toUpperCase()) ?? null;

export const calculateShipping = (subtotal) =>
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

export const calculateDiscount = (coupon, subtotal) => {
    if (!coupon) return 0;
    if (coupon.type === 'percent') return (subtotal * coupon.value) / 100;
    return Math.min(coupon.value, subtotal);
};

// Arredonda para 2 casas evitando erros de ponto flutuante.
const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

// Recebe as linhas do carrinho ({ product, quantity }) e devolve os totais.
export const buildOrderTotals = (cartItems, couponCode) => {
    const items = cartItems.map(({ product, quantity }) => ({
        id: product.id,
        name: product.name,
        unitPrice: round2(parsePrice(product.price)),
        quantity,
        total: round2(parsePrice(product.price) * quantity),
    }));

    const subtotal = round2(items.reduce((sum, item) => sum + item.total, 0));
    const coupon = findCoupon(couponCode);
    const discount = round2(calculateDiscount(coupon, subtotal));
    const shipping = round2(calculateShipping(subtotal));
    const total = round2(subtotal - discount + shipping);

    return {
        items,
        subtotal,
        discount,
        shipping,
        total,
        coupon: coupon?.code ?? null,
    };
};
