const express = require('express');
const router = express.Router();
const Deces = require('../models/Deces');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// 📄 Création d’un acte de décès
router.post('/', authMiddleware, roleMiddleware(['admin', 'agent']), async (req, res) => {
  try {
    const {
      nom_defunt,
      date_deces,
      lieu_deces,
      cause_deces,
      officier,
      numero_registre
    } = req.body;

    if (!nom_defunt || !date_deces || !lieu_deces || !officier || !numero_registre) {
      return res.status(400).json({ message: 'Champs obligatoires manquants.' });
    }

    // Vérifier unicité du numero_registre
    const existing = await Deces.findOne({ where: { numero_registre } });
    if (existing) {
      return res.status(400).json({ message: 'Numéro de registre déjà utilisé.' });
    }

    const newDeces = await Deces.create({
      nom_defunt,
      date_deces,
      lieu_deces,
      cause_deces,
      officier,
      numero_registre
    });

    res.status(201).json({ message: 'Acte de décès créé avec succès', deces: newDeces });
  } catch (error) {
    console.error('💥 Erreur création acte décès:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création de l\'acte de décès' });
  }
});

// 📋 Liste de tous les actes de décès (admin, agent)
router.get('/', authMiddleware, roleMiddleware(['admin', 'agent']), async (req, res) => {
  try {
    const decesList = await Deces.findAll();
    res.json({ deces: decesList });
  } catch (error) {
    console.error('💥 Erreur récupération actes décès:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 🔎 Obtenir un acte de décès par ID
router.get('/:id', authMiddleware, roleMiddleware(['admin', 'agent']), async (req, res) => {
  try {
    const deces = await Deces.findByPk(req.params.id);
    if (!deces) {
      return res.status(404).json({ message: 'Acte de décès introuvable' });
    }
    res.json({ deces });
  } catch (error) {
    console.error('💥 Erreur récupération acte décès:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✏️ Mise à jour d’un acte de décès
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'agent']), async (req, res) => {
  try {
    const deces = await Deces.findByPk(req.params.id);
    if (!deces) {
      return res.status(404).json({ message: 'Acte de décès introuvable' });
    }

    const {
      nom_defunt,
      date_deces,
      lieu_deces,
      cause_deces,
      officier,
      numero_registre
    } = req.body;

    // Mise à jour des champs s'ils sont fournis
    if (nom_defunt) deces.nom_defunt = nom_defunt;
    if (date_deces) deces.date_deces = date_deces;
    if (lieu_deces) deces.lieu_deces = lieu_deces;
    if (cause_deces) deces.cause_deces = cause_deces;
    if (officier) deces.officier = officier;
    if (numero_registre) {
      // Vérifier unicité si changé
      if (numero_registre !== deces.numero_registre) {
        const existing = await Deces.findOne({ where: { numero_registre } });
        if (existing) {
          return res.status(400).json({ message: 'Numéro de registre déjà utilisé.' });
        }
      }
      deces.numero_registre = numero_registre;
    }

    await deces.save();
    res.json({ message: 'Acte de décès mis à jour avec succès', deces });
  } catch (error) {
    console.error('💥 Erreur mise à jour acte décès:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de l\'acte de décès' });
  }
});

// ❌ Suppression d’un acte de décès
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const deces = await Deces.findByPk(req.params.id);
    if (!deces) {
      return res.status(404).json({ message: 'Acte de décès introuvable' });
    }

    await deces.destroy();
    res.json({ message: 'Acte de décès supprimé avec succès' });
  } catch (error) {
    console.error('💥 Erreur suppression acte décès:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;