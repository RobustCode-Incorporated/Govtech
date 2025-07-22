// 🔐 Chargement des variables d'environnement
require('dotenv').config();

// 🔧 Importations des modules
const express = require('express');
const bodyParser = require('body-parser');

// 📦 Import des modèles via index.js
const db = require('./models'); // ✅ Centralisation ici

// 📦 Import des routes
const citizenRoutes = require('./routes/citizenRoutes');
const adminRoutes = require('./routes/adminRoutes');
const naissanceRoutes = require('./routes/naissanceRoutes');
const mariageRoutes = require('./routes/mariageRoutes');
const decesRoutes = require('./routes/decesRoutes');
const residenceRoutes = require('./routes/residenceRoutes');
const passportRoutes = require('./routes/passeportRoutes');
const casierJudiciaireRoutes = require('./routes/casierJudiciaireRoutes');
const permisRoutes = require('./routes/permisConduireRoutes');
const carteGriseRoutes = require('./routes/carteGriseRoutes');
const requestRoutes = require('./routes/requestRoutes');
const citizenMariageRoutes = require('./routes/citizenMariageRoutes');
// const identiteRoutes = require('./routes/identiteRoutes'); // (optionnel pour plus tard)

// 🚀 Initialisation de l'app
const app = express();

// Middleware global pour logger toutes les requêtes reçues
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

// 🔌 Connexion à la base de données
db.sequelize.authenticate()
  .then(() => console.log('🟢 Connexion à PostgreSQL réussie'))
  .catch(err => console.error('🔴 Erreur connexion DB', err));

// 🧱 Synchronisation des modèles Sequelize
db.sequelize.sync({ force: true }) // ⚠️ désactive force:true en production !
  .then(() => console.log('🛠️ Tables synchronisées'))
  .catch(err => console.error('❌ Erreur sync:', err));

// 🧩 Middlewares globaux
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 🌐 Routes API
app.use('/api/citizens', citizenRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/naissances', naissanceRoutes);
app.use('/api/mariages', mariageRoutes);
app.use('/api/deces', decesRoutes);
app.use('/api/residences', residenceRoutes);
app.use('/api/passeports', passportRoutes);
app.use('/api/casiers', casierJudiciaireRoutes);
app.use('/api/permis', permisRoutes);
app.use('/api/carte-grise', carteGriseRoutes);
app.use('/api/auth', citizenRoutes); // 🔁 Si tu veux que login/register passent aussi ici
app.use('/api', requestRoutes);
app.use('/api/citizen/mariages', citizenMariageRoutes);
// app.use('/api/identite', identiteRoutes); // à réactiver si nécessaire

// 🌍 Route test
app.get('/', (req, res) => {
  res.send('Bienvenue sur GovTech Backend API');
});

// 🟢 Démarrage du serveur
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});