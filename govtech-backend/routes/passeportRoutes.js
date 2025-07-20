const express = require('express');
const router = express.Router();
const Passeport = require('../models/Passeport');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// 🔐 Créer un passeport (admin ou agent)
router.post('/', authMiddleware, roleMiddleware(['admin', 'agent']), async (req, res) => {
  try {
    const {
      citoyenId,
      numeroPasseport,
      typePasseport,
      dateEmission,
      dateExpiration,
      demandeType,
      paysEmission,
      statut,
      empreinteDigitale,
      photoFace
    } = req.body;

    if (!citoyenId || !numeroPasseport || !typePasseport || !dateEmission || !dateExpiration || !demandeType) {
      return res.status(400).json({ message: 'Champs obligatoires manquants.' });
    }

    // Vérifier si un passeport existe déjà pour ce citoyen (One-to-One)
    const existing = await Passeport.findOne({ where: { citoyenId } });
    if (existing) {
      return res.status(409).json({ message: 'Un passeport existe déjà pour ce citoyen.' });
    }

    const passeport = await Passeport.create({
      citoyenId,
      numeroPasseport,
      typePasseport,
      dateEmission,
      dateExpiration,
      demandeType,
      paysEmission,
      statut: statut || 'valide',
      empreinteDigitale,
      photoFace
    });

    res.status(201).json({ message: 'Passeport créé avec succès', passeport });
  } catch (error) {
    console.error('Erreur création passeport:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création du passeport' });
  }
});

// 📋 Liste des passeports (admin ou agent)
router.get('/', authMiddleware, roleMiddleware(['admin', 'agent']), async (req, res) => {
  try {
    const passeports = await Passeport.findAll();
    res.json({ passeports });
  } catch (error) {
    console.error('Erreur récupération passeports:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 🔎 Détails d’un passeport par ID
router.get('/:id', authMiddleware, roleMiddleware(['admin', 'agent']), async (req, res) => {
  try {
    const passeport = await Passeport.findByPk(req.params.id);
    if (!passeport) {
      return res.status(404).json({ message: 'Passeport introuvable' });
    }
    res.json({ passeport });
  } catch (error) {
    console.error('Erreur récupération passeport:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 🔄 Mise à jour d’un passeport
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'agent']), async (req, res) => {
  try {
    const passeport = await Passeport.findByPk(req.params.id);
    if (!passeport) {
      return res.status(404).json({ message: 'Passeport introuvable' });
    }

    const updateData = req.body;
    await passeport.update(updateData);

    res.json({ message: 'Passeport mis à jour avec succès', passeport });
  } catch (error) {
    console.error('Erreur mise à jour passeport:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour' });
  }
});

// ❌ Suppression d’un passeport
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const passeport = await Passeport.findByPk(req.params.id);
    if (!passeport) {
      return res.status(404).json({ message: 'Passeport introuvable' });
    }

    await passeport.destroy();
    res.json({ message: 'Passeport supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression passeport:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression' });
  }
});

module.exports = router;