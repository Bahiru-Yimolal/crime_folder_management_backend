// models/Role.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Assumes sequelize instance is initialized here
const Event = require("./eventModel"); // Import User model

const QRform = sequelize.define(
  "QRform",
  {
    qrform: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    fullName: { type: DataTypes.STRING, allowNull: false },

    sector: { type: DataTypes.STRING, allowNull: false },

    rate: { type: DataTypes.STRING, allowNull: false },

    gender: { type: DataTypes.STRING, allowNull: false },

    deviceAddress: { type: DataTypes.STRING, allowNull: false },

    deviceLocation: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Event,
        key: "event_id",
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

Event.hasMany(QRform, { foreignKey: "event_id" });

QRform.belongsTo(Event, { foreignKey: "event_id" });

module.exports = QRform;
