const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../config/database');

const sequelize = config; // tu utilises déjà `sequelize` comme instance
const db = {};

// Charger tous les fichiers modèles du dossier actuel (sauf index.js)
fs.readdirSync(__dirname)
  .filter((file) => file !== 'index.js' && file.endsWith('.js'))
  .forEach((file) => {
    const model = require(path.join(__dirname, file));
    db[model.name] = model;
  });

// Exécuter les associations définies dans les modèles
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db); // 🔁 Appliquer les relations
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;