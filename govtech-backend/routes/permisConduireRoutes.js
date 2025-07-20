// routes/permisConduireRoutes.js
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const PermisConduire = require('../models/PermisConduire');
const Citoyen = require('../models/Citoyen');

const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const permissionMiddleware = require('../middlewares/permissionMiddleware');

// 📌 Créer un permis de conduire
router.post('/', authMiddleware, roleMiddleware(['admin', 'agent']), permissionMiddleware('permis'), async (req, res) => {
  try {
    const { citoyenId, numeroPermis, typePermis, dateDelivrance, dateExpiration } = req.body;

    if (!citoyenId || !numeroPermis || !typePermis || !dateDelivrance || !dateExpiration) {
      return res.status(400).json({ message: 'Champs requis manquants.' });
    }

    const existing = await PermisConduire.findOne({ where: { numeroPermis } });
    if (existing) {
      return res.status(409).json({ message: 'Ce numéro de permis existe déjà.' });
    }

    const permis = await PermisConduire.create({
      citoyenId,
      numeroPermis,
      typePermis,
      dateDelivrance,
      dateExpiration,
    });

    res.status(201).json({ message: 'Permis créé avec succès', permis });
  } catch (error) {
    console.error('💥 Erreur création permis:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 📋 Lister tous les permis
router.get('/', authMiddleware, roleMiddleware(['admin', 'agent']), permissionMiddleware('permis'), async (req, res) => {
  try {
    const permis = await PermisConduire.findAll({
      include: { model: Citoyen, as: 'citoyen', attributes: ['id', 'nuc', 'nom', 'prenom'] }
    });
    res.json({ permis });
  } catch (error) {
    console.error('💥 Erreur récupération permis:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 🔄 Modifier un permis
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'agent']), permissionMiddleware('permis'), async (req, res) => {
  try {
    const permis = await PermisConduire.findByPk(req.params.id);
    if (!permis) return res.status(404).json({ message: 'Permis introuvable' });

    await permis.update(req.body);
    res.json({ message: 'Permis mis à jour', permis });
  } catch (error) {
    console.error('💥 Erreur modification permis:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ❌ Supprimer un permis
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), permissionMiddleware('permis'), async (req, res) => {
  try {
    const permis = await PermisConduire.findByPk(req.params.id);
    if (!permis) return res.status(404).json({ message: 'Permis introuvable' });

    await permis.destroy();
    res.json({ message: 'Permis supprimé' });
  } catch (error) {
    console.error('💥 Erreur suppression permis:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;