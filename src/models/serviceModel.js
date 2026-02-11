const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Service = sequelize.define(
    "Service",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        place: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "Dedicated time in minutes/hours",
        },
        quality_standard: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        delivery_mode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        preconditions: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        unit_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "AdministrativeUnits", key: "id" },
        },
        paymentAmount: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        completion_metric: {
            type: DataTypes.ENUM("OFFICER", "CITIZEN", "BOTH_AVERAGE"),
            allowNull: false,
            defaultValue: "OFFICER",
        },
        created_by: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "Users", key: "user_id" },
        },
    },
    {
        timestamps: true,
        tableName: "Services",
    }
);

module.exports = Service;
