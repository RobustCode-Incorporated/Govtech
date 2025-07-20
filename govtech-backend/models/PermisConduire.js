// models/PermisConduire.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Citoyen = require('./Citoyen');

const PermisConduire = sequelize.define('PermisConduire', {
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
    }
  },
  numeroPermis: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  typePermis: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['A', 'B', 'C', 'D', 'E', 'F']],
    },
  },
  dateDelivrance: {
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
    defaultValue: 'valide', // valide | suspendu | expiré
  },
}, {
  tableName: 'permis_conduire',
  timestamps: true,
});

// 🔁 Associations
Citoyen.hasMany(PermisConduire, { foreignKey: 'citoyenId', as: 'permis' });
PermisConduire.belongsTo(Citoyen, { foreignKey: 'citoyenId', as: 'citoyen' });

module.exports = PermisConduire;