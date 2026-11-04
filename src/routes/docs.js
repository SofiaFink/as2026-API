const path = require('path');
const fs = require('fs');
const express = require('express');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');

const router = express.Router();
const specPath = path.join(__dirname, '..', '..', 'swagger.yaml');

function loadSpec() {
  const raw = fs.readFileSync(specPath, 'utf8');
  return yaml.load(raw);
}

router.get('/swagger.yaml', (req, res) => {
  res.type('application/yaml');
  res.send(fs.readFileSync(specPath, 'utf8'));
});

router.use('/docs', swaggerUi.serve, swaggerUi.setup(loadSpec(), {
  customSiteTitle: 'AS2026 Checkout API'
}));

module.exports = router;
