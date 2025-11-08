const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Make sure you have the database connection configured
const Committee = require("./committeeModel");
const User = require("./userModel");

const Attendance = sequelize.define(
  "Attendance",
  {
    attendance_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    committee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Committee,
        key: "committee_id",
      },
      onDelete: "CASCADE",
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false, // Allow null if no leader is assigned
      references: {
        model: User, // Refers to the User model
        key: "user_id", // The column in the User model that the group_leader_id references
      },
      onDelete: "CASCADE",
      //   onDelete: "SET NULL", // Optional: if the referenced user is deleted, set the group_leader_id to NULL
    },
     check_in_time: {
      type: DataTypes.DATE,
      allowNull: true,

    },

    check_out_time: {
      type: DataTypes.DATE,
      allowNull: true,

    },

    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
 
    },

    device_info: {
      type: DataTypes.JSONB,
      allowNull: true,

    },

    location: {
      type: DataTypes.JSONB,
      allowNull: true,

    },

  },
  {
    timestamps: true, // Disable timestamps if not needed
  }
);

// Association

Attendance.belongsTo(User, {
  foreignKey: "user_id"
});

User.hasMany(Attendance, { foreignKey: "user_id" });


Attendance.belongsTo(Committee, { foreignKey: "committee_id" }); // Correct foreignKey reference

Committee.hasMany(Attendance, { foreignKey: "committee_id" }); // Ensure reverse association is consistent

module.exports = Attendance;
