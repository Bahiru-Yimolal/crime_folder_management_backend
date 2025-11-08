const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Profile = require("./profileModel");

const WorkHistory = sequelize.define(
  "WorkHistory",
  {
    work_history_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // Association
    registered_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Profile,
        key: "profile_id",
      },
      onDelete: "CASCADE",
    },

    // Personal Info
    organization: { type: DataTypes.STRING, allowNull: false },
    courseType: { type: DataTypes.STRING, allowNull: false },
    sector: { type: DataTypes.STRING, allowNull: false },
    isComplete: { type: DataTypes.STRING, allowNull: false },
    certificateLink: { type: DataTypes.STRING, allowNull: true },
    certificate: { type: DataTypes.STRING, allowNull: true },
    date: { type: DataTypes.DATE, allowNull: true },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);

// Association
Profile.hasMany(WorkHistory, { foreignKey: "registered_by" });
WorkHistory.belongsTo(Profile, { foreignKey: "registered_by" });

module.exports = WorkHistory;
