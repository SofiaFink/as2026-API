const express = require('express');
const { getCart, setCart } = require('../db');
const { requireAuth } = require('../auth');
const { checkoutTotals } = require('../cartService');

const router = express.Router();
const PAYMENT_METHODS = ['cash', 'credit_card'];

router.post('/checkout', requireAuth, (req, res) => {
  const paymentMethod = String((req.body || {}).paymentMethod || '').toLowerCase();

  if (!PAYMENT_METHODS.includes(paymentMethod)) {
    return res.status(400).json({
      error: 'ValidationError',
      message: 'paymentMethod must be "cash" or "credit_card".'
    });
  }

  const cart = getCart(req.user.id);
  if (!cart.items.length) {
    return res.status(400).json({
      error: 'EmptyCart',
      message: 'Add products to the cart before checkout.'
    });
  }

  const summary = checkoutTotals(cart, paymentMethod);
  setCart(req.user.id, []);

  return res.status(200).json({
    message: 'Checkout completed',
    order: {
      userId: req.user.id,
      email: req.user.email,
      ...summary
    }
  });
});

module.exports = router;
