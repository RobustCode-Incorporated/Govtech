// routes/citizenRoutes.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Citizen = require('../models/Citoyen'); // <-- corrige ici, pas de destructuration
const generateNUC = require('../utils/generateNUC'); // Assure que ce chemin est correct

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
      role
    } = req.body;

    if (!nom || !prenom || !motDePasse || !date_naissance) {
      return res.status(400).json({
        message: 'Nom, prénom, motDePasse et date de naissance sont obligatoires.'
      });
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
        role: newCitizen.role
      }
    });
  } catch (error) {
    console.error('💥 Erreur inscription:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription' });
  }
});

module.exports = router;