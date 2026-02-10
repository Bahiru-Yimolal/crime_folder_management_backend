const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AdministrativeUnit = sequelize.define(
  "AdministrativeUnit",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    level: {
      type: DataTypes.ENUM("ETHIOPIA", "CITY", "SUBCITY", "SECTOR"),
      allowNull: false,
    },
    parent_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "AdministrativeUnits",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    tableName: "AdministrativeUnits",
  }
);

module.exports = AdministrativeUnit;
