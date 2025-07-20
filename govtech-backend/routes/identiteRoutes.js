//

const express = require('express');
const router = express.Router();
const Identite = require('../models/Identite');
const Citoyen = require('../models/Citoyen');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// 📄 Créer une identité (seulement admin ou agent)
router.post('/', authMiddleware, roleMiddleware(['admin', 'agent']), async (req, res) => {
  try {
    const {
      citoyenId,
      nuc,
      identifiantNum,
      clePublique,
      dateEmission,
      dateExpiration,
      statut
    } = req.body;

    if (!citoyenId || !nuc || !identifiantNum || !clePublique || !dateEmission || !dateExpiration) {
      return res.status(400).json({ message: 'Champs obligatoires manquants.' });
    }

    // Vérifier que le citoyen existe
    const citoyen = await Citoyen.findByPk(citoyenId);
    if (!citoyen) {
      return res.status(404).json({ message: 'Citoyen non trouvé.' });
    }

    // Vérifier qu'il n'a pas déjà une identité
    const existingIdentite = await Identite.findOne({ where: { citoyenId } });
    if (existingIdentite) {
      return res.status(400).json({ message: 'Une identité existe déjà pour ce citoyen.' });
    }

    const identite = await Identite.create({
      citoyenId,
      nuc,
      identifiantNum,
      clePublique,
      dateEmission,
      dateExpiration,
      statut: statut || 'valide',
    });

    res.status(201).json({ message: 'Identité créée avec succès.', identite });
  } catch (error) {
    console.error('Erreur création identité:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création de l\'identité.' });
  }
});

// 📄 Obtenir toutes les identités (admin ou agent)
router.get('/', authMiddleware, roleMiddleware(['admin', 'agent']), async (req, res) => {
  try {
    const identites = await Identite.findAll({
      include: [{ model: Citoyen, as: 'citoyen', attributes: ['id', 'nom', 'prenom', 'postnom', 'nuc', 'role'] }]
    });
    res.json({ identites });
  } catch (error) {
    console.error('Erreur récupération identités:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 📄 Obtenir une identité par ID (admin, agent ou le citoyen lui-même)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const identite = await Identite.findByPk(req.params.id, {
      include: [{ model: Citoyen, as: 'citoyen', attributes: ['id', 'nom', 'prenom', 'postnom', 'nuc', 'role'] }]
    });
    if (!identite) {
      return res.status(404).json({ message: 'Identité non trouvée.' });
    }

    // Contrôle d'accès : admin, agent, ou citoyen propriétaire
    if (req.user.role !== 'admin' && req.user.role !== 'agent' && req.user.id !== identite.citoyenId) {
      return res.status(403).json({ message: 'Accès refusé.' });
    }

    res.json({ identite });
  } catch (error) {
    console.error('Erreur récupération identité:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 🔄 Mettre à jour une identité (admin ou agent)
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'agent']), async (req, res) => {
  try {
    const identite = await Identite.findByPk(req.params.id);
    if (!identite) {
      return res.status(404).json({ message: 'Identité non trouvée.' });
    }

    const {
      nuc,
      identifiantNum,
      clePublique,
      dateEmission,
      dateExpiration,
      statut
    } = req.body;

    if (nuc !== undefined) identite.nuc = nuc;
    if (identifiantNum !== undefined) identite.identifiantNum = identifiantNum;
    if (clePublique !== undefined) identite.clePublique = clePublique;
    if (dateEmission !== undefined) identite.dateEmission = dateEmission;
    if (dateExpiration !== undefined) identite.dateExpiration = dateExpiration;
    if (statut !== undefined) identite.statut = statut;

    await identite.save();

    res.json({ message: 'Identité mise à jour avec succès.', identite });
  } catch (error) {
    console.error('Erreur mise à jour identité:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour.' });
  }
});

// ❌ Supprimer une identité (admin uniquement)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const identite = await Identite.findByPk(req.params.id);
    if (!identite) {
      return res.status(404).json({ message: 'Identité non trouvée.' });
    }

    await identite.destroy();
    res.json({ message: 'Identité supprimée avec succès.' });
  } catch (error) {
    console.error('Erreur suppression identité:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression.' });
  }
});

module.exports = router;
//