const express = require('express');
const { findProductById, setCart } = require('../db');
const { requireAuth } = require('../auth');
const { buildCartResponse } = require('../cartService');

const router = express.Router();

router.post('/cart', requireAuth, (req, res) => {
  const { items } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      error: 'ValidationError',
      message: 'Cart items must be a non-empty array of { productId, quantity }.'
    });
  }

  const normalized = [];

  for (const item of items) {
    const product = findProductById(item.productId);
    const quantity = Number(item.quantity);

    if (!product) {
      return res.status(404).json({
        error: 'NotFound',
        message: `Product ${item.productId} was not found.`
      });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        error: 'ValidationError',
        message: 'Each item quantity must be an integer of 1 or more.'
      });
    }

    const existing = normalized.find((entry) => entry.productId === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      normalized.push({ productId: product.id, quantity });
    }
  }

  const cart = setCart(req.user.id, normalized);
  return res.status(200).json(buildCartResponse(cart));
});

module.exports = router;
