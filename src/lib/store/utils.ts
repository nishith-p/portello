// Hack fix for delegate payment related renderings
export const isDelegatePayment = (amount: number | string): boolean => {
  // eslint-disable-next-line eqeqeq
  return amount == 560 || amount == 630;
}

export const applyDiscountIfApplicable = (amount: number | string): number => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  // If it's not a delegate payment, apply 10% discount
  if (!isDelegatePayment(numericAmount)) {
    return numericAmount * 0.9;
  }

  // If it's a delegate payment, return original amount
  return numericAmount;
};
