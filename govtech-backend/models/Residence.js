// models/Residence.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Residence = sequelize.define('Residence', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  citoyenId: {  // référence au citoyen
    type: DataTypes.UUID,
    allowNull: false,
  },
  adresse: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date_debut: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  date_fin: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  numero_registre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  officier: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'residences',
  timestamps: true,
});

module.exports = Residence;