const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateNUC = require('../utils/generateNUC');
const Citizen = require('../models/Citoyen');
const AgentPermission = require('../models/AgentPermission'); // 🔹 Import du modèle
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// 🔐 Création d’un administrateur (à protéger ou utiliser en setup)
router.post('/create-admin', async (req, res) => {
  try {
    const {
      nom, postnom, prenom, motDePasse, date_naissance, genre,
      commune, adresse, numeroTel, provinceCode
    } = req.body;

    if (!nom || !prenom || !motDePasse || !date_naissance) {
      return res.status(400).json({ message: 'Champs obligatoires manquants.' });
    }

    const provCode = provinceCode || 'KIN';

    let nuc;
    let exists = true;
    do {
      nuc = generateNUC(date_naissance, provCode);
      const existingNUC = await Citizen.findOne({ where: { nuc } });
      if (!existingNUC) exists = false;
    } while (exists);

    const hash = await bcrypt.hash(motDePasse, 10);

    const admin = await Citizen.create({
      nuc, nom, postnom, prenom, motDePasse: hash,
      date_naissance, genre, commune, adresse, numeroTel,
      role: 'admin'
    });

    res.status(201).json({
      message: 'Administrateur créé avec succès',
      admin: {
        id: admin.id,
        nuc: admin.nuc,
        nom: admin.nom,
        prenom: admin.prenom,
        postnom: admin.postnom
      }
    });
  } catch (error) {
    console.error('💥 Erreur création admin:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création de l\'admin' });
  }
});

// 📋 Liste de tous les citoyens (admin only)
router.get('/citizens', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const citoyens = await Citizen.findAll({
      attributes: ['id', 'nuc', 'nom', 'prenom', 'postnom', 'role']
    });
    res.json({ citoyens });
  } catch (error) {
    console.error('💥 Erreur récupération citoyens:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 🔄 Modifier le rôle d’un citoyen (promotion incluant 'agent')
router.put('/citizens/:id/role', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const citizen = await Citizen.findByPk(req.params.id);
    if (!citizen) return res.status(404).json({ message: 'Citoyen introuvable' });

    const { role } = req.body;
    const validRoles = ['citoyen', 'agent', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Rôle invalide. Les rôles valides sont : citoyen, agent, admin.' });
    }

    citizen.role = role;
    await citizen.save();

    res.json({ message: `Rôle mis à jour avec succès en '${role}'`, citizen });
  } catch (error) {
    console.error('💥 Erreur mise à jour rôle:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ❌ Supprimer un citoyen
router.delete('/citizens/:id', authMiddleware, roleMiddleware(['admin', 'agent']), async (req, res) => {
  try {
    const citizen = await Citizen.findByPk(req.params.id);
    if (!citizen) return res.status(404).json({ message: 'Citoyen introuvable' });

    await citizen.destroy();
    res.json({ message: 'Citoyen supprimé avec succès' });
  } catch (error) {
    console.error('💥 Erreur suppression citoyen:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ 🎯 Affecter des permissions à un agent
router.post('/permissions', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { agentId, modules } = req.body;
    if (!agentId || !Array.isArray(modules)) {
      return res.status(400).json({ message: 'agentId et modules (tableau) sont requis.' });
    }

    const agent = await Citizen.findByPk(agentId);
    if (!agent || agent.role !== 'agent') {
      return res.status(404).json({ message: 'Agent introuvable ou rôle invalide' });
    }

    await AgentPermission.destroy({ where: { agentId } });

    const permissionsToCreate = modules.map(module => ({ agentId, module }));
    const newPermissions = await AgentPermission.bulkCreate(permissionsToCreate);

    res.status(201).json({
      message: 'Permissions enregistrées avec succès',
      permissions: newPermissions
    });
  } catch (error) {
    console.error('💥 Erreur assignation permissions:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'assignation des permissions' });
  }
});

// 🔍 Consulter les permissions d’un agent (admin only)
router.get('/agents/:id/permissions', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const permissions = await AgentPermission.findAll({
      where: { agentId: req.params.id },
      attributes: ['id', 'module', 'createdAt']
    });

    res.json({ permissions });
  } catch (error) {
    console.error('💥 Erreur récupération permissions agent:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 👤 Consulter les permissions de l’agent connecté
router.get('/me/permissions', authMiddleware, roleMiddleware(['agent']), async (req, res) => {
  try {
    const permissions = await AgentPermission.findAll({
      where: { agentId: req.user.id },
      attributes: ['id', 'module', 'createdAt']
    });

    res.json({ permissions });
  } catch (error) {
    console.error('💥 Erreur récupération permissions (agent):', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;