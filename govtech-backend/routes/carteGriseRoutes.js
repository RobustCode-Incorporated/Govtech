const express = require('express');
const router = express.Router();
const CarteGrise = require('../models/CarteGrise');
const Citoyen = require('../models/Citoyen');

const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const permissionMiddleware = require('../middlewares/permissionMiddleware');

// 🔐 Créer une carte grise
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin', 'agent']),
  permissionMiddleware('carte_grise'),
  async (req, res) => {
    try {
      const {
        citoyenId,
        numeroImmatriculation,
        marque,
        modele,
        typeVehicule,
        couleur,
        numeroChassis,
        puissanceFiscale,
        dateDelivrance
      } = req.body;

      if (!citoyenId || !numeroImmatriculation || !marque || !modele || !typeVehicule || !couleur || !numeroChassis || !dateDelivrance) {
        return res.status(400).json({ message: 'Tous les champs obligatoires doivent être fournis.' });
      }

      const carte = await CarteGrise.create({
        citoyenId,
        numeroImmatriculation,
        marque,
        modele,
        typeVehicule,
        couleur,
        numeroChassis,
        puissanceFiscale,
        dateDelivrance
      });

      res.status(201).json({ message: 'Carte grise créée avec succès.', carte });
    } catch (error) {
      console.error('💥 Erreur création carte grise:', error);
      res.status(500).json({ message: 'Erreur serveur lors de la création' });
    }
  }
);

// 📄 Lister toutes les cartes grises
router.get(
  '/',
  authMiddleware,
  roleMiddleware(['admin', 'agent']),
  permissionMiddleware('carte_grise'),
  async (req, res) => {
    try {
      const cartes = await CarteGrise.findAll({
        include: {
          model: Citoyen,
          as: 'proprietaire',
          attributes: ['id', 'nuc', 'nom', 'prenom']
        }
      });
      res.json(cartes);
    } catch (error) {
      console.error('💥 Erreur récupération cartes grises:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
);

// 🗑️ Supprimer une carte grise
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  permissionMiddleware('carte_grise'),
  async (req, res) => {
    try {
      const carte = await CarteGrise.findByPk(req.params.id);
      if (!carte) {
        return res.status(404).json({ message: 'Carte grise introuvable.' });
      }

      await carte.destroy();
      res.json({ message: 'Carte grise supprimée avec succès.' });
    } catch (error) {
      console.error('💥 Erreur suppression:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
);

module.exports = router;