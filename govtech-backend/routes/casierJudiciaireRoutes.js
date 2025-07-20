// routes/casierJudiciaireRoutes.js
const express = require('express');
const router = express.Router();
const CasierJudiciaire = require('../models/CasierJudiciaire');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// 📋 Liste de tous les casiers judiciaires (admin ou agent)
router.get('/', authMiddleware, roleMiddleware(['admin', 'agent']), async (req, res) => {
  try {
    const casiers = await CasierJudiciaire.findAll({
      include: { association: 'citoyen', attributes: ['id', 'nom', 'prenom', 'nuc'] },
      order: [['createdAt', 'DESC']]
    });
    res.json({ casiers });
  } catch (error) {
    console.error('💥 Erreur récupération casiers judiciaires:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 📋 Obtenir un casier judiciaire par ID
router.get('/:id', authMiddleware, roleMiddleware(['admin', 'agent']), async (req, res) => {
  try {
    const casier = await CasierJudiciaire.findByPk(req.params.id, {
      include: { association: 'citoyen', attributes: ['id', 'nom', 'prenom', 'nuc'] }
    });
    if (!casier) return res.status(404).json({ message: 'Casier judiciaire introuvable' });

    res.json({ casier });
  } catch (error) {
    console.error('💥 Erreur récupération casier judiciaire:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ➕ Créer un casier judiciaire
router.post('/', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { citoyenId, numeroCasier, dateEmission, statut, details } = req.body;

    if (!citoyenId || !numeroCasier || !dateEmission) {
      return res.status(400).json({ message: 'citoyenId, numeroCasier et dateEmission sont obligatoires' });
    }

    // Vérifier qu'aucun casier n'existe déjà pour ce citoyen (one-to-one)
    const existing = await CasierJudiciaire.findOne({ where: { citoyenId } });
    if (existing) {
      return res.status(400).json({ message: 'Un casier judiciaire existe déjà pour ce citoyen' });
    }

    const newCasier = await CasierJudiciaire.create({
      citoyenId,
      numeroCasier,
      dateEmission,
      statut: statut || 'valide',
      details: details || null
    });

    res.status(201).json({ message: 'Casier judiciaire créé avec succès', casier: newCasier });
  } catch (error) {
    console.error('💥 Erreur création casier judiciaire:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création' });
  }
});

// 🔄 Mettre à jour un casier judiciaire
router.put('/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const casier = await CasierJudiciaire.findByPk(req.params.id);
    if (!casier) return res.status(404).json({ message: 'Casier judiciaire introuvable' });

    const { numeroCasier, dateEmission, statut, details } = req.body;

    if (numeroCasier) casier.numeroCasier = numeroCasier;
    if (dateEmission) casier.dateEmission = dateEmission;
    if (statut) casier.statut = statut;
    if (details !== undefined) casier.details = details;

    await casier.save();

    res.json({ message: 'Casier judiciaire mis à jour avec succès', casier });
  } catch (error) {
    console.error('💥 Erreur mise à jour casier judiciaire:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour' });
  }
});

// ❌ Supprimer un casier judiciaire
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const casier = await CasierJudiciaire.findByPk(req.params.id);
    if (!casier) return res.status(404).json({ message: 'Casier judiciaire introuvable' });

    await casier.destroy();
    res.json({ message: 'Casier judiciaire supprimé avec succès' });
  } catch (error) {
    console.error('💥 Erreur suppression casier judiciaire:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression' });
  }
});

module.exports = router;