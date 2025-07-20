const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Citoyen = sequelize.define('Citoyen', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nuc: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postnom: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  motDePasse: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date_naissance: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  commune: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  adresse: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  numeroTel: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'citoyen',
    validate: {
      isIn: [['citoyen', 'agent', 'admin']],
    },
  }
}, {
  tableName: 'citoyens',
  timestamps: true
});

// Relation avec les permissions (AgentPermission)
Citoyen.associate = (models) => {
  Citoyen.hasMany(models.AgentPermission, {
    foreignKey: 'agentId', // 'agentId' car c'est la clé dans AgentPermission
    as: 'permissions'
  });

  // Relation avec Residence
  Citoyen.hasMany(models.Residence, {
    foreignKey: 'citoyenId',
    as: 'residences'
  });
};

module.exports = Citoyen;