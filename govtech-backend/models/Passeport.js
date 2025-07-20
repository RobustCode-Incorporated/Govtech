const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Citoyen = require('./Citoyen');

const Passeport = sequelize.define('Passeport', {
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
    unique: true,
  },
  numeroPasseport: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  typePasseport: {
    type: DataTypes.ENUM('biometrique', 'autorite', 'standard'),
    allowNull: false,
    defaultValue: 'biometrique',
    comment: 'Type de passeport: biométrique, autorité, ou standard',
  },
  dateEmission: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  dateExpiration: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  demandeType: {
    type: DataTypes.ENUM('premiere_demande', 'renouvellement'),
    allowNull: false,
    defaultValue: 'premiere_demande',
    comment: 'Type de demande de passeport',
  },
  paysEmission: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'RDC', // adapter selon le pays, par défaut la RDC
  },
  statut: {
    type: DataTypes.ENUM('valide', 'suspendu', 'expire', 'annule'),
    allowNull: false,
    defaultValue: 'valide',
  },
  empreinteDigitale: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    comment: 'Indique si empreintes digitales ont été collectées',
  },
  photoFace: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'URL ou chemin de la photo biométrique',
  }
}, {
  tableName: 'passeports',
  timestamps: true,
});

// Relations
Citoyen.hasOne(Passeport, { foreignKey: 'citoyenId', as: 'passeport' });
Passeport.belongsTo(Citoyen, { foreignKey: 'citoyenId', as: 'citoyen' });

module.exports = Passeport;