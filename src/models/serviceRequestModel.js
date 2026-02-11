const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ServiceRequest = sequelize.define(
    "ServiceRequest",
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
        user_phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("PENDING", "CONFIRMED", "REJECTED", "IN_PROGRESS", "COMPLETED"),
            defaultValue: "PENDING",
        },
        group_leader_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: { model: "Users", key: "user_id" },
        },
        officer_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: { model: "Users", key: "user_id" },
        },
        start_time: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        officer_completed_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        citizen_completed_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        final_completion_time: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        expected_completion: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        completion_status: {
            type: DataTypes.ENUM("GREEN", "RED"),
            allowNull: true,
        },
        rejection_reason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        delay_reason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        timestamps: true,
        tableName: "ServiceRequests",
    }
);

module.exports = ServiceRequest;
