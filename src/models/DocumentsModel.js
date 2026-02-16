const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Documents = sequelize.define(
    "Documents",
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        crime_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "CrimeFolders", key: "id" },
        },
        administrative_unit_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "AdministrativeUnits", key: "id" },
        },
        file_name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        file_type: {
            type: DataTypes.SMALLINT,
            allowNull: false,
        },
        file_path: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        file_size: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        uploaded_by: {
            type: DataTypes.UUID,
            allowNull: true,
            references: { model: "Users", key: "user_id" },
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "Documents",
        timestamps: false,
        indexes: [
            { fields: ["crime_id"] },
            { fields: ["administrative_unit_id"] },
            { fields: ["uploaded_by"] },
        ],
    }
);

module.exports = Documents;
