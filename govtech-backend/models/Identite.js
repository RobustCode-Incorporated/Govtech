// models/Identite.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Citoyen = require('./Citoyen');

const Identite = sequelize.define('Identite', {
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
    unique: true, // One-to-One relation
  },
  nuc: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  identifiantNum: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  clePublique: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  dateEmission: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  dateExpiration: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  statut: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'valide', // 'valide', 'suspendue', 'expiree', ...
  }
}, {
  tableName: 'identites',
  timestamps: true,
});

// Relations
Citoyen.hasOne(Identite, { foreignKey: 'citoyenId', as: 'identite' });
Identite.belongsTo(Citoyen, { foreignKey: 'citoyenId', as: 'citoyen' });

module.exports = Identite;