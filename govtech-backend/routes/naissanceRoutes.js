const express = require('express');
const router = express.Router();
const Naissance = require('../models/Naissance');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const permissionMiddleware = require('../middlewares/permissionMiddleware');

// 🌐 Middleware commun
const secured = [authMiddleware, roleMiddleware(['agent']), permissionMiddleware('naissance')];

/**
 * 📥 Créer un acte de naissance
 */
router.post('/', secured, async (req, res) => {
  try {
    const {
      enfant_nom,
      enfant_postnom,
      enfant_prenom,
      sexe,
      date_naissance,
      lieu_naissance,
      nom_pere,
      nom_mere
    } = req.body;

    const naissance = await Naissance.create({
      enfant_nom,
      enfant_postnom,
      enfant_prenom,
      sexe,
      date_naissance,
      lieu_naissance,
      nom_pere,
      nom_mere,
      agentId: req.user.id,
    });

    res.status(201).json({ message: 'Acte de naissance enregistré', naissance });
  } catch (error) {
    console.error('💥 Erreur création naissance:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/**
 * 📃 Lister tous les actes de naissance créés par l’agent connecté
 */
router.get('/', secured, async (req, res) => {
  try {
    const actes = await Naissance.findAll({ where: { agentId: req.user.id } });
    res.json({ actes });
  } catch (error) {
    console.error('💥 Erreur récupération actes:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/**
 * 🔄 Modifier un acte de naissance
 */
router.put('/:id', secured, async (req, res) => {
  try {
    const acte = await Naissance.findByPk(req.params.id);

    if (!acte || acte.agentId !== req.user.id) {
      return res.status(404).json({ message: 'Acte non trouvé ou accès refusé' });
    }

    await acte.update(req.body);
    res.json({ message: 'Acte mis à jour', acte });
  } catch (error) {
    console.error('💥 Erreur mise à jour:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/**
 * ❌ Supprimer un acte
 */
router.delete('/:id', secured, async (req, res) => {
  try {
    const acte = await Naissance.findByPk(req.params.id);

    if (!acte || acte.agentId !== req.user.id) {
      return res.status(404).json({ message: 'Acte non trouvé ou accès refusé' });
    }

    await acte.destroy();
    res.json({ message: 'Acte supprimé avec succès' });
  } catch (error) {
    console.error('💥 Erreur suppression:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;