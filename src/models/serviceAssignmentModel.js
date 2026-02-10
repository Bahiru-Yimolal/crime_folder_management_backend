const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ServiceAssignment = sequelize.define(
    "ServiceAssignment",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        service_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "Services", key: "id" },
        },
        group_leader_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "Users", key: "user_id" },
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        timestamps: true,
        tableName: "ServiceAssignments",
    }
);

module.exports = ServiceAssignment;
