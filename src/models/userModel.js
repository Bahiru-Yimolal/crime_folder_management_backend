const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true, // Ensure email is unique
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "assigned"),
      defaultValue: "pending",
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "user",
    },
    sector: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isSeen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true, // Optional: if you don't want Sequelize to add `updated_at` or `created_at` automatically
    tableName: "Users", // Optional: to specify the name of the table explicitly
  }
);

// User.hasOne(Role, { foreignKey: "user_id" });
// Role.belongsTo(User, { foreignKey: "user_id" });

module.exports = User;
