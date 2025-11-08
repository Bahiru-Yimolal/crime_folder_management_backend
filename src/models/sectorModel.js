const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Make sure you have the database connection configured\
const User = require("./userModel"); // Import the User model
// const Division = require("./divisionModel"); // Import the User model
const Subcity = require("./subcityModel");

const Sector = sequelize.define(
  "Sector",
  {
    sector_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sector_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sector_leader_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Allow null if no leader is assigned
      references: {
        model: User, // Refers to the User model
        key: "user_id", // The column in the User model that the group_leader_id references
      },
      onDelete: "CASCADE",
      //   onDelete: "SET NULL", // Optional: if the referenced user is deleted, set the group_leader_id to NULL
    },
    subcity_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Subcity,
        key: "subcity_id",
      },
      onDelete: "CASCADE",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false, // Disable timestamps if not needed
  }
);

// Association
Sector.belongsTo(User, { foreignKey: "sector_leader_id", as: "sector_Leader" });

User.hasMany(Sector, { foreignKey: "sector_leader_id" });

Sector.belongsTo(Subcity, { foreignKey: "subcity_id" }); // Correct foreignKey reference

Subcity.hasMany(Sector, { foreignKey: "subcity_id" }); // Ensure reverse association is consistent

module.exports = Sector;
