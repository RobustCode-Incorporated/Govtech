const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Citoyen = require('./Citoyen');

const CarteGrise = sequelize.define('CarteGrise', {
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
  },
  numeroImmatriculation: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  marque: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  modele: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  typeVehicule: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  couleur: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numeroChassis: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  puissanceFiscale: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dateDelivrance: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  statut: {
    type: DataTypes.STRING,
    defaultValue: 'valide', // ou expirée, suspendue, etc.
  }
}, {
  tableName: 'cartes_grises',
  timestamps: true,
});

// 🔗 Relation avec Citoyen
CarteGrise.belongsTo(Citoyen, { foreignKey: 'citoyenId', as: 'proprietaire' });
Citoyen.hasMany(CarteGrise, { foreignKey: 'citoyenId', as: 'vehicules' });

module.exports = CarteGrise;