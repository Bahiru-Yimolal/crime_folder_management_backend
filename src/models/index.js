const User = require("./userModel");
const AdministrativeUnit = require("./administrativeUnitModel");
const Role = require("./roleModel");
const Permission = require("./permissionModel");
const UserAssignment = require("./userAssignment");
const UserPermission = require("./userPermissionModel");
const AuditLog = require("./auditLogModel");

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

module.exports = {
  User,
  AdministrativeUnit,
  Role,
  Permission,
  UserAssignment,
  UserPermission,
  AuditLog,
};


