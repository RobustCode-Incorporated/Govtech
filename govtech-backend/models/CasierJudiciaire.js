// models/CasierJudiciaire.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Citoyen = require('./Citoyen');

const CasierJudiciaire = sequelize.define('CasierJudiciaire', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  citoyenId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Citoyen,
      key: 'id',
    },
    unique: true, // un casier par citoyen
  },
  numeroCasier: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  dateEmission: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  statut: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'valide', // 'valide', 'suspendu', 'expire', etc.
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true, // pour des informations additionnelles ou mentions
  }
}, {
  tableName: 'casier_judiciaires',
  timestamps: true,
});

// Relations
Citoyen.hasOne(CasierJudiciaire, { foreignKey: 'citoyenId', as: 'casierJudiciaire' });
CasierJudiciaire.belongsTo(Citoyen, { foreignKey: 'citoyenId', as: 'citoyen' });

module.exports = CasierJudiciaire;