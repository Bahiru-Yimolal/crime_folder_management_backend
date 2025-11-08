const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Event = sequelize.define(
  "Event",
  {
    event_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    subTitle: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: false },
    sector: { type: DataTypes.STRING, allowNull: false },
    placeOfEvent: { type: DataTypes.STRING, allowNull: true },
    state: { type: DataTypes.STRING, allowNull: false },
    noOfParticipant: { type: DataTypes.INTEGER, allowNull: false },
    realParticipant: { type: DataTypes.INTEGER, allowNull: true },
    attendance:{ type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
    attendantPhoto:{ type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
    date: { type: DataTypes.DATE, allowNull: false },
    photos: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
    visiblity: { type: DataTypes.STRING, allowNull: false },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);


module.exports = Event;
