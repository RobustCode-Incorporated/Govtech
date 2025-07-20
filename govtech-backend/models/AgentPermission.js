// models/AgentPermission.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AgentPermission = sequelize.define('AgentPermission', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  agentId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  module: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'agent_permissions',
  timestamps: true,
});

AgentPermission.associate = (models) => {
  AgentPermission.belongsTo(models.Citoyen, {
    foreignKey: 'agentId',
    as: 'agent'
  });
};

module.exports = AgentPermission;