const User = require("./userModel");
const AdministrativeUnit = require("./administrativeUnitModel");
const Role = require("./roleModel");
const Permission = require("./permissionModel");
const UserAssignment = require("./userAssignment");
const UserPermission = require("./userPermissionModel");
const CrimeFolder = require("./crimeFolderModel");
const CrimeFolderAttachment = require("./crimeFolderAttachment");
const AuditLog = require("./auditLogModel");
const Service = require("./serviceModel");
const ServiceAssignment = require("./serviceAssignmentModel");

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

// CrimeFolder associations
CrimeFolder.belongsTo(AdministrativeUnit, { foreignKey: "unit_id" });
CrimeFolder.belongsTo(User, { foreignKey: "created_by" });
AdministrativeUnit.hasMany(CrimeFolder, { foreignKey: "unit_id" });
User.hasMany(CrimeFolder, { foreignKey: "created_by" });

// CrimeFolderAttachment associations
CrimeFolder.hasMany(CrimeFolderAttachment, { foreignKey: "crime_folder_id" });
CrimeFolderAttachment.belongsTo(CrimeFolder, { foreignKey: "crime_folder_id" });
CrimeFolderAttachment.belongsTo(User, { foreignKey: "uploaded_by" });

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

module.exports = {
  User,
  AdministrativeUnit,
  Role,
  Permission,
  UserAssignment,
  UserPermission,
  CrimeFolder,
  CrimeFolderAttachment,
  AuditLog,
  Service,
  ServiceAssignment,
};


