const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Plan = sequelize.define(
  "Plan",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    sector: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    plan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    plan_to_update: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    isSeen: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Plan;
