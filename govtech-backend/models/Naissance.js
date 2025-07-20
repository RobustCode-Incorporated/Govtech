const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Naissance = sequelize.define('Naissance', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  enfant_nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  enfant_postnom: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  enfant_prenom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sexe: {
    type: DataTypes.ENUM('masculin', 'féminin'),
    allowNull: false,
  },
  date_naissance: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  lieu_naissance: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Informations parents
  nom_pere: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nom_mere: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // Agent en charge
  agentId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  // Statut (ex: validé, en cours)
  statut: {
    type: DataTypes.STRING,
    defaultValue: 'en_attente',
  }

}, {
  tableName: 'naissances',
  timestamps: true,
});

module.exports = Naissance;