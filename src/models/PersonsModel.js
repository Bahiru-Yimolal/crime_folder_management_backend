const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Persons = sequelize.define(
    "Persons",
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        full_name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        national_id: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        phone_number: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        crime_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "CrimeFolders", key: "id" },
        },
        role: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "Persons",
        timestamps: false,
        indexes: [
            { unique: true, fields: ["national_id", "crime_id"] },
            { fields: ["full_name"] },
            { fields: ["crime_id"] },
        ],
    }
);

module.exports = Persons;
