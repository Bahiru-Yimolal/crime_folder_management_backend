const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Make sure you have the database connection configured\
const User = require("./userModel"); // Import the User model
// const Division = require("./divisionModel"); // Import the User model
const Subcity = require("./subcityModel");
const Sector = require("./sectorModel");

const Committee = sequelize.define(
  "Committee",
  {
    committee_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    committee_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
    school_address: {
          type: DataTypes.STRING,
          allowNull: false,
        },
     school_type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
    school_location: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
    committee_leader_id: {
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
       sector_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: Sector,
            key: "sector_id",
          },
          onDelete: "CASCADE",
        },
  },
  {
    timestamps: true, // Disable timestamps if not needed
  }
);

// Association
Committee.belongsTo(User, {
  foreignKey: "committee_leader_id",
  as: "committee_Leader",
});

User.hasMany(Committee, { foreignKey: "committee_leader_id" });

Committee.belongsTo(Subcity, { foreignKey: "subcity_id" }); // Correct foreignKey reference

Subcity.hasMany(Committee, { foreignKey: "subcity_id" }); // Ensure reverse association is consistent

Committee.belongsTo(Sector, { foreignKey: "sector_id" }); // Correct foreignKey reference

Sector.hasMany(Committee, { foreignKey: "sector_id" }); // Ensure reverse association is consistent

module.exports = Committee;
