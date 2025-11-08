const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Make sure you have the database connection configured\
const User = require("./userModel"); // Import the User model
// const Division = require("./divisionModel"); // Import the User model

const Subcity = sequelize.define(
  "Subcity",
  {
    subcity_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    subcity_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subcity_leader_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Allow null if no leader is assigned
      references: {
        model: User, // Refers to the User model
        key: "user_id", // The column in the User model that the group_leader_id references
      },
      onDelete: "CASCADE",
      //   onDelete: "SET NULL", // Optional: if the referenced user is deleted, set the group_leader_id to NULL
    },
    // division_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: Division,
    //     key: "division_id",
    //   },
    //   onDelete: "CASCADE",
    // },
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
Subcity.belongsTo(User, { foreignKey: "subcity_leader_id", as: "subcity_Leader" });

User.hasMany(Subcity, { foreignKey: "subcity_leader_id" });

// Group.belongsTo(Division, { foreignKey: "group_id" });

// Division.hasMany(Group, { foreignKey: "division_id" });

module.exports = Subcity;
