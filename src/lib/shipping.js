// Regra de frete do site: grátis acima do limite, valor fixo abaixo dele.
export const FREE_SHIPPING_THRESHOLD = 249.9;
export const SHIPPING_FEE = 19.9;

export const calculateShipping = (subtotal) =>
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

export const missingForFreeShipping = (subtotal) =>
    Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
