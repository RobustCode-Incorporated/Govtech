const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Deces = sequelize.define('Deces', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nom_defunt: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date_deces: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  lieu_deces: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cause_deces: {
    type: DataTypes.STRING,
    allowNull: true
  },
  officier: {
    type: DataTypes.STRING,
    allowNull: false
  },
  numero_registre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'deces',
  timestamps: true
});

module.exports = Deces;