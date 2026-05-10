export const formatPrice = (price: number): string => {
  return `${price.toFixed(3)} TND`;
};

export const formatDiscount = (original: number, current: number): number => {
  return Math.round(((original - current) / original) * 100);
};
