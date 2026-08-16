import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'nirmaan-delhi-secure-jwt-secret-2026';

/**
 * Generates a signed JWT token for authenticated users
 */
export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      zone: user.zone,
      designation: user.designation
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Middleware to authenticate requests using Bearer JWT
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired session token.' });
    }
    req.user = user;
    next();
  });
}

/**
 * Middleware to enforce role-based access control
 * @param {Array<string>} allowedRoles e.g. ['ADMIN'], ['WORKER', 'ADMIN']
 */
export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]. Current role: ${req.user.role}` 
      });
    }

    next();
  };
}
