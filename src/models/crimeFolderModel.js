const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CrimeFolder = sequelize.define(
  "CrimeFolder",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    unit_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "AdministrativeUnits", key: "id" },
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "Users", key: "user_id" },
    },
    crime_inspection_number: { type: DataTypes.STRING(100), allowNull: false },
    computer_id: { type: DataTypes.STRING(100), allowNull: true },
    accusers_names: { type: DataTypes.TEXT, allowNull: false },
    accused_names: { type: DataTypes.TEXT, allowNull: false },
    type_of_crime: { type: DataTypes.STRING(100), allowNull: false },
    inspection_place: { type: DataTypes.STRING(255), allowNull: false },
    inspectors_name: { type: DataTypes.TEXT, allowNull: false },
    lawyer_name: { type: DataTypes.TEXT, allowNull: true },
    justice_taken_place: { type: DataTypes.STRING(255), allowNull: true },
    appointment: { type: DataTypes.DATE, allowNull: true },
    decision: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    timestamps: true,
    tableName: "CrimeFolders",
  }
);

module.exports = CrimeFolder;
