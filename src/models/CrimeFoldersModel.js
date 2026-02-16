const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CrimeFolders = sequelize.define(
    "CrimeFolders",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        inspection_number: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        administrative_unit_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "AdministrativeUnits", key: "id" },
        },
        crime_category: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        inspection_location_place: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        justice_location_place: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        inspector_name: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        lawyer_name: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        folder_creation_day: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        appointment_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        decision: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.SMALLINT,
            defaultValue: 1,
        },
        created_by: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "Users", key: "user_id" },
        },
    },
    {
        tableName: "CrimeFolders",
        timestamps: true,
        indexes: [
            { unique: true, fields: ["inspection_number"] },
            { fields: ["administrative_unit_id"] },
            { fields: ["status"] },
        ],
    }
);

module.exports = CrimeFolders;
