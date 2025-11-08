const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const List = sequelize.define(
  "List",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    columns: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
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

module.exports = List;
