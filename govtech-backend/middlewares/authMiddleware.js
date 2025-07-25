// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');

/**
 * Middleware d'authentification + vérification de rôle
 * @param {Array} roles - Les rôles autorisés, ex: ['citoyen', 'agent']
 */
module.exports = function (roles = []) {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token manquant ou invalide' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Si des rôles sont spécifiés, vérifier si l'utilisateur en fait partie
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Accès interdit : rôle non autorisé' });
      }

      next();
    } catch (err) {
      console.error('❌ Erreur de vérification JWT:', err);
      return res.status(403).json({ message: 'Accès refusé. Token invalide.' });
    }
  };
};