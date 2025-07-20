// middlewares/permissionMiddleware.js
const AgentPermission = require('../models/AgentPermission');

const permissionMiddleware = (moduleName) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      if (!user || user.role !== 'agent') {
        return res.status(403).json({ message: 'Accès réservé aux agents uniquement.' });
      }

      const permission = await AgentPermission.findOne({
        where: {
          agentId: user.id,
          module: moduleName
        }
      });

      if (!permission) {
        return res.status(403).json({ message: `Permission manquante pour le module '${moduleName}'` });
      }

      next(); // ✅ Accès autorisé
    } catch (error) {
      console.error('💥 Erreur permissionMiddleware:', error);
      res.status(500).json({ message: 'Erreur serveur (permission)' });
    }
  };
};

module.exports = permissionMiddleware;