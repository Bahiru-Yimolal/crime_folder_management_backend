const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const Profile = sequelize.define(
  "Profile",
  {
    profile_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // Personal Info
    firstName: { type: DataTypes.STRING, allowNull: false },
    middleName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    sex: { type: DataTypes.STRING, allowNull: false },
    dateOfBirth: { type: DataTypes.DATEONLY, allowNull: false },
    emailAddress: { type: DataTypes.STRING, allowNull: false },
    phoneNumber: { type: DataTypes.STRING, allowNull: false },
    subcity: { type: DataTypes.STRING, allowNull: false },
    workType: { type: DataTypes.STRING, allowNull: false },
    subcitySector: { type: DataTypes.STRING, allowNull: true },
    subcityCenter: { type: DataTypes.STRING, allowNull: true },
    educationLevel: { type: DataTypes.STRING, allowNull: true },
    educationType: { type: DataTypes.STRING, allowNull: true },
    profilePhoto: { type: DataTypes.STRING, allowNull: true },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);


module.exports = Profile;
