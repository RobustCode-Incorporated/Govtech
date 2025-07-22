// controllers/requestController.js

const Citoyen = require('../models/Citoyen');
const Naissance = require('../models/Naissance');
const Mariage = require('../models/Mariage');
const Passeport = require('../models/Passeport');
const PermisConduire = require('../models/PermisConduire');

async function getRequests(req, res) {
  try {
    const citoyenId = req.user.id; // récupéré via authMiddleware

    const naissances = await Naissance.findAll({ where: { citoyenId } });
    const mariages = await Mariage.findAll({ where: { citoyenId } });
    const passeports = await Passeport.findAll({ where: { citoyenId } });
    const permisConduire = await PermisConduire.findAll({ where: { citoyenId } });

    res.json({
      naissances,
      mariages,
      passeports,
      permisConduire,
    });
  } catch (error) {
    console.error('Erreur récupération demandes:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des demandes' });
  }
}

module.exports = { getRequests };