module.exports = function(requiredRoles) {
    return (req, res, next) => {
      if (!req.user || !requiredRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Accès refusé : rôle insuffisant' });
      }
      next();
    };
  };