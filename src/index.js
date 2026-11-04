const express = require('express');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');
const docsRoutes = require('./routes/docs');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(docsRoutes);
app.use('/', authRoutes);
app.use('/', cartRoutes);
app.use('/', checkoutRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'NotFound',
    message: `No route matches ${req.method} ${req.path}`
  });
});

app.listen(port, () => {
  console.log(`AS2026 Checkout API listening on http://localhost:${port}`);
  console.log(`Swagger UI: http://localhost:${port}/docs`);
  console.log(`OpenAPI YAML: http://localhost:${port}/swagger.yaml`);
});

module.exports = app;
