const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Citoyen = require('./Citoyen'); // Assure-toi que ce modèle existe

const Mariage = sequelize.define('Mariage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  epoux_nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  epoux_postnom: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  epoux_prenom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  epouse_nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  epouse_postnom: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  epouse_prenom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date_mariage: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  lieu_mariage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  officier_etat_civil: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  agentId: {
    type: DataTypes.UUID,
    allowNull: true, // Devient facultatif si un citoyen peut créer aussi
  },
  citoyenId: {
    type: DataTypes.UUID,
    allowNull: true, // Devient requis côté logique si la demande vient du citoyen
  },
}, {
  tableName: 'mariages',
  timestamps: true,
});

// 🔗 Définir la relation avec Citoyen
Mariage.belongsTo(Citoyen, { foreignKey: 'citoyenId', as: 'citoyen' });

module.exports = Mariage;