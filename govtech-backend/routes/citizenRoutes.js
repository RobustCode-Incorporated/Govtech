const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Citizen = require('../models/Citoyen');
const generateNUC = require('../utils/generateNUC');
const authMiddleware = require('../middlewares/authMiddleware');

// 🔹 POST /api/citizens/register
router.post('/register', async (req, res) => {
  try {
    console.log("✅ Requête d'inscription reçue:", req.body);

    const {
      nom,
      postnom,
      prenom,
      motDePasse,
      date_naissance,
      genre,
      commune,
      adresse,
      numeroTel,
      provinceCode,
      role
    } = req.body;

    // 🔒 Vérification des champs obligatoires
    if (!nom || !prenom || !motDePasse || !date_naissance) {
      return res.status(400).json({
        message: 'Nom, prénom, mot de passe et date de naissance sont obligatoires.'
      });
    }

    const provCode = provinceCode || 'KIN';

    // 🔄 Générer un NUC unique
    let nuc;
    let exists = true;
    do {
      nuc = generateNUC(date_naissance, provCode);
      const existingNUC = await Citizen.findOne({ where: { nuc } });
      if (!existingNUC) exists = false;
    } while (exists);

    const hash = await bcrypt.hash(motDePasse, 10);

    const newCitizen = await Citizen.create({
      nuc,
      nom,
      postnom,
      prenom,
      motDePasse: hash,
      date_naissance,
      genre,
      commune,
      adresse,
      numeroTel,
      role: role || 'citoyen',
    });

    const token = jwt.sign(
      { id: newCitizen.id, nuc: newCitizen.nuc, role: newCitizen.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.status(201).json({
      message: 'Inscription réussie',
      token,
      user: {
        id: newCitizen.id,
        nuc: newCitizen.nuc,
        nom: newCitizen.nom,
        postnom: newCitizen.postnom,
        prenom: newCitizen.prenom,
        role: newCitizen.role,
      }
    });
  } catch (error) {
    console.error('💥 Erreur inscription citoyen:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription' });
  }
});

// 🔹 GET /api/citizens/profile — Profil du citoyen connecté (protégé)
router.get('/profile', authMiddleware(['citoyen', 'admin', 'agent']), async (req, res) => {
  try {
    const citizenId = req.user.id;
    const citizen = await Citizen.findByPk(citizenId);

    if (!citizen) {
      return res.status(404).json({ message: 'Citoyen non trouvé' });
    }

    res.status(200).json({
      citizen: {
        id: citizen.id,
        nuc: citizen.nuc,
        nom: citizen.nom,
        postnom: citizen.postnom,
        prenom: citizen.prenom,
        genre: citizen.genre,
        date_naissance: citizen.date_naissance,
        role: citizen.role,
        commune: citizen.commune,
        adresse: citizen.adresse,
        numeroTel: citizen.numeroTel
      }
    });
  } catch (error) {
    console.error('💥 Erreur récupération profil citoyen:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération du profil' });
  }
});

module.exports = router;