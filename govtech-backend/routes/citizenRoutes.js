const express = require('express');
const router = express.Router();
const Citizen = require('../models/Citoyen');
const bcrypt = require('bcrypt');
const generateNUC = require('../utils/generateNUC');
const jwt = require('jsonwebtoken');

// Route POST /register
router.post('/register', async (req, res) => {
  try {
    console.log("✅ Requête reçue:", req.body);

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
      role // optionnel
    } = req.body;

    if (!nom || !prenom || !motDePasse || !date_naissance) {
      return res.status(400).json({ message: 'Nom, prénom, motDePasse et date de naissance sont obligatoires.' });
    }

    const provCode = provinceCode || 'KIN';

    // Générer un NUC unique
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
      role: role || 'citoyen'
    });

    res.status(201).json({
      message: 'Inscription réussie',
      citizen: {
        id: newCitizen.id,
        nuc: newCitizen.nuc,
        nom: newCitizen.nom,
        postnom: newCitizen.postnom,
        prenom: newCitizen.prenom,
        role: newCitizen.role
      }
    });
  } catch (error) {
    console.error('💥 Erreur inscription:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription' });
  }
});

// Route POST /login
router.post('/login', async (req, res) => {
  try {
    const { nuc, motDePasse } = req.body;

    if (!nuc || !motDePasse) {
      return res.status(400).json({ message: 'NUC et mot de passe sont requis.' });
    }

    // Trouver le citoyen par NUC
    const citizen = await Citizen.findOne({ where: { nuc } });
    if (!citizen) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(motDePasse, citizen.motDePasse);
    if (!validPassword) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: citizen.id, nuc: citizen.nuc, role: citizen.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.json({
      message: 'Authentification réussie',
      token,
      citizen: {
        id: citizen.id,
        nuc: citizen.nuc,
        nom: citizen.nom,
        prenom: citizen.prenom,
        postnom: citizen.postnom,
        role: citizen.role
      }
    });
  } catch (error) {
    console.error('💥 Erreur login:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
});

module.exports = router;