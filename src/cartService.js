const { findProductById } = require('./db');

function buildCartResponse(cart) {
  const items = cart.items.map((item) => {
    const product = findProductById(item.productId);
    const unitPrice = product.price;
    const lineTotal = unitPrice * item.quantity;

    return {
      productId: product.id,
      name: product.name,
      quantity: item.quantity,
      unitPrice,
      lineTotal
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  return { items, subtotal };
}

function checkoutTotals(cart, paymentMethod) {
  const cartView = buildCartResponse(cart);
  const discountRate = paymentMethod === 'cash' ? 0.1 : 0;
  const discount = Number((cartView.subtotal * discountRate).toFixed(2));
  const total = Number((cartView.subtotal - discount).toFixed(2));

  return {
    ...cartView,
    paymentMethod,
    discountRate,
    discount,
    total
  };
}

module.exports = { buildCartResponse, checkoutTotals };
