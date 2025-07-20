const express = require('express');
const router = express.Router();
const Mariage = require('../models/Mariage');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

// ➕ Créer un acte de mariage
router.post('/', authMiddleware, roleMiddleware(['agent', 'admin']), checkPermission('mariage'), async (req, res) => {
  try {
    const { nom_mari, nom_femme, date_mariage, lieu_mariage, officier, numero_registre } = req.body;

    if (!nom_mari || !nom_femme || !date_mariage || !lieu_mariage || !officier || !numero_registre) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    const mariage = await Mariage.create({
      nom_mari,
      nom_femme,
      date_mariage,
      lieu_mariage,
      officier,
      numero_registre
    });

    res.status(201).json({ message: 'Acte de mariage enregistré', mariage });
  } catch (error) {
    console.error('💥 Erreur création mariage:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 📋 Récupérer tous les actes
router.get('/', authMiddleware, roleMiddleware(['agent', 'admin']), checkPermission('mariage'), async (req, res) => {
  try {
    const mariages = await Mariage.findAll();
    res.json({ mariages });
  } catch (error) {
    console.error('💥 Erreur récupération mariages:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 📄 Récupérer un acte par ID
router.get('/:id', authMiddleware, roleMiddleware(['agent', 'admin']), checkPermission('mariage'), async (req, res) => {
  try {
    const mariage = await Mariage.findByPk(req.params.id);
    if (!mariage) {
      return res.status(404).json({ message: 'Acte de mariage introuvable' });
    }
    res.json({ mariage });
  } catch (error) {
    console.error('💥 Erreur récupération acte:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✏️ Modifier un acte
router.put('/:id', authMiddleware, roleMiddleware(['agent', 'admin']), checkPermission('mariage'), async (req, res) => {
  try {
    const mariage = await Mariage.findByPk(req.params.id);
    if (!mariage) {
      return res.status(404).json({ message: 'Acte de mariage introuvable' });
    }

    await mariage.update(req.body);
    res.json({ message: 'Acte de mariage mis à jour', mariage });
  } catch (error) {
    console.error('💥 Erreur mise à jour mariage:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ❌ Supprimer un acte
router.delete('/:id', authMiddleware, roleMiddleware(['agent', 'admin']), checkPermission('mariage'), async (req, res) => {
  try {
    const mariage = await Mariage.findByPk(req.params.id);
    if (!mariage) {
      return res.status(404).json({ message: 'Acte de mariage introuvable' });
    }

    await mariage.destroy();
    res.json({ message: 'Acte de mariage supprimé avec succès' });
  } catch (error) {
    console.error('💥 Erreur suppression mariage:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;