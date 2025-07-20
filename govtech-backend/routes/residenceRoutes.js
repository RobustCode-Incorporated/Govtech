// routes/residenceRoutes.js
const express = require('express');
const router = express.Router();
const Residence = require('../models/Residence');
const Citizen = require('../models/Citoyen');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Créer un certificat de résidence (admin et agent)
router.post('/', authMiddleware, roleMiddleware(['admin', 'agent']), async (req, res) => {
  try {
    const {
      citoyenId,
      adresse,
      date_debut,
      date_fin,
      numero_registre,
      officier
    } = req.body;

    if (!citoyenId || !adresse || !date_debut || !numero_registre || !officier) {
      return res.status(400).json({ message: 'Champs obligatoires manquants.' });
    }

    // Vérifier que le citoyen existe
    const citoyen = await Citizen.findByPk(citoyenId);
    if (!citoyen) {
      return res.status(404).json({ message: 'Citoyen non trouvé.' });
    }

    const residence = await Residence.create({
      citoyenId,
      adresse,
      date_debut,
      date_fin,
      numero_registre,
      officier
    });

    res.status(201).json({ message: 'Certificat de résidence créé.', residence });
  } catch (error) {
    console.error('Erreur création certificat résidence:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer tous les certificats de résidence (admin et agent)
router.get('/', authMiddleware, roleMiddleware(['admin', 'agent']), async (req, res) => {
  try {
    const residences = await Residence.findAll({
      include: [{ model: Citizen, as: 'citoyen', attributes: ['id', 'nom', 'prenom', 'postnom', 'nuc'] }]
    });
    res.json({ residences });
  } catch (error) {
    console.error('Erreur récupération certificats résidence:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer un certificat par ID (admin et agent)
router.get('/:id', authMiddleware, roleMiddleware(['admin', 'agent']), async (req, res) => {
  try {
    const residence = await Residence.findByPk(req.params.id, {
      include: [{ model: Citizen, as: 'citoyen', attributes: ['id', 'nom', 'prenom', 'postnom', 'nuc'] }]
    });
    if (!residence) {
      return res.status(404).json({ message: 'Certificat non trouvé.' });
    }
    res.json({ residence });
  } catch (error) {
    console.error('Erreur récupération certificat résidence:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mettre à jour un certificat de résidence (admin uniquement)
router.put('/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const residence = await Residence.findByPk(req.params.id);
    if (!residence) {
      return res.status(404).json({ message: 'Certificat non trouvé.' });
    }

    const {
      adresse,
      date_debut,
      date_fin,
      numero_registre,
      officier
    } = req.body;

    await residence.update({
      adresse: adresse || residence.adresse,
      date_debut: date_debut || residence.date_debut,
      date_fin: date_fin || residence.date_fin,
      numero_registre: numero_registre || residence.numero_registre,
      officier: officier || residence.officier
    });

    res.json({ message: 'Certificat mis à jour.', residence });
  } catch (error) {
    console.error('Erreur mise à jour certificat résidence:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer un certificat de résidence (admin uniquement)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const residence = await Residence.findByPk(req.params.id);
    if (!residence) {
      return res.status(404).json({ message: 'Certificat non trouvé.' });
    }

    await residence.destroy();
    res.json({ message: 'Certificat supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur suppression certificat résidence:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;