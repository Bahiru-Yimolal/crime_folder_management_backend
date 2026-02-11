const User = require("./userModel");
const AdministrativeUnit = require("./administrativeUnitModel");
const Role = require("./roleModel");
const Permission = require("./permissionModel");
const UserAssignment = require("./userAssignment");
const UserPermission = require("./userPermissionModel");
const AuditLog = require("./auditLogModel");
const Service = require("./serviceModel");
const ServiceAssignment = require("./serviceAssignmentModel");
const ServiceRequest = require("./serviceRequestModel");

// User -> UserAssignment
User.hasMany(UserAssignment, { foreignKey: "user_id" });
UserAssignment.belongsTo(User, { foreignKey: "user_id" });

// Unit -> UserAssignment
AdministrativeUnit.hasMany(UserAssignment, { foreignKey: "unit_id" });
UserAssignment.belongsTo(AdministrativeUnit, { foreignKey: "unit_id" });

// Role -> UserAssignment
Role.hasMany(UserAssignment, { foreignKey: "role_id" });
UserAssignment.belongsTo(Role, { foreignKey: "role_id" });

// UserAssignment -> UserPermission
UserAssignment.hasMany(UserPermission, { foreignKey: "assignment_id" });
UserPermission.belongsTo(UserAssignment, { foreignKey: "assignment_id" });

// Permission -> UserPermission
Permission.hasMany(UserPermission, { foreignKey: "permission_id" });
UserPermission.belongsTo(Permission, { foreignKey: "permission_id" });

// AuditLog associations
AuditLog.belongsTo(User, { foreignKey: "user_id" });
AuditLog.belongsTo(AdministrativeUnit, { foreignKey: "unit_id" });

// Service associations
Service.belongsTo(AdministrativeUnit, { foreignKey: "unit_id" });
AdministrativeUnit.hasMany(Service, { foreignKey: "unit_id" });
Service.belongsTo(User, { foreignKey: "created_by" });
User.hasMany(Service, { foreignKey: "created_by" });

// ServiceAssignment associations
Service.hasMany(ServiceAssignment, { foreignKey: "service_id" });
ServiceAssignment.belongsTo(Service, { foreignKey: "service_id" });
ServiceAssignment.belongsTo(User, { foreignKey: "group_leader_id" });
User.hasMany(ServiceAssignment, { foreignKey: "group_leader_id" });

// ServiceRequest associations
Service.hasMany(ServiceRequest, { foreignKey: "service_id" });
ServiceRequest.belongsTo(Service, { foreignKey: "service_id" });
ServiceRequest.belongsTo(User, { as: "GroupLeader", foreignKey: "group_leader_id" });
ServiceRequest.belongsTo(User, { as: "Officer", foreignKey: "officer_id" });
User.hasMany(ServiceRequest, { as: "GroupLeaderRequests", foreignKey: "group_leader_id" });
User.hasMany(ServiceRequest, { as: "OfficerRequests", foreignKey: "officer_id" });

module.exports = {
  User,
  AdministrativeUnit,
  Role,
  Permission,
  UserAssignment,
  UserPermission,
  AuditLog,
  Service,
  ServiceAssignment,
  ServiceRequest,
};


