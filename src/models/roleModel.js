// models/Role.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Assumes sequelize instance is initialized here
const User = require("./userModel"); // Import User model

const Role = sequelize.define(
  "Role",
  {
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    categories: {
      type: DataTypes.ENUM("Sub-City Head", "Sector Leader", "Admin", "Committee"),
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // This could potentially reference different tables based on category.
      // For example, it could be a group_id for a group_leader or another ID for professionals.
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
      onDelete: "CASCADE",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false, // Disables automatic timestamping if not needed
    // tableName: "roles", // Custom table name, if desired
  }
);

User.hasMany(Role, { foreignKey: "user_id" });

Role.belongsTo(User, { foreignKey: "user_id" });

module.exports = Role;
