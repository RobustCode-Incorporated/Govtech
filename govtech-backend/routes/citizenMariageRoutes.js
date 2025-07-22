// routes/citizenMariageRoutes.js

const express = require('express');
const router = express.Router();
const Mariage = require('../models/Mariage');
const authMiddleware = require('../middlewares/authMiddleware');

// POST /api/citizen/mariages - Soumettre une demande de mariage (citoyen)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const citoyenId = req.user.id;

    const {
      epoux_nom,
      epoux_postnom,
      epoux_prenom,
      epouse_nom,
      epouse_postnom,
      epouse_prenom,
      date_mariage,
      lieu_mariage
    } = req.body;

    if (!epoux_nom || !epoux_prenom || !epouse_nom || !epouse_prenom || !date_mariage || !lieu_mariage) {
      return res.status(400).json({ message: 'Certains champs obligatoires sont manquants.' });
    }

    const mariage = await Mariage.create({
      epoux_nom,
      epoux_postnom: epoux_postnom || null,
      epoux_prenom,
      epouse_nom,
      epouse_postnom: epouse_postnom || null,
      epouse_prenom,
      date_mariage,
      lieu_mariage,
      citoyenId
    });

    res.status(201).json({ message: 'Demande de mariage enregistrée', mariage });
  } catch (error) {
    console.error('💥 Erreur soumission mariage:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;