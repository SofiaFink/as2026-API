const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'as2026-dev-secret';

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'A Bearer token is required. Log in first.'
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email, name: payload.name };
    return next();
  } catch (error) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'The access token is invalid or expired.'
    });
  }
}

module.exports = { signToken, requireAuth };
