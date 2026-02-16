const User = require("./userModel");
const AdministrativeUnit = require("./administrativeUnitModel");
const Role = require("./roleModel");
const Permission = require("./permissionModel");
const UserAssignment = require("./userAssignment");
const UserPermission = require("./userPermissionModel");
const AuditLog = require("./auditLogModel");

// New crime folder models
const CrimeFolders = require("./CrimeFoldersModel");
const Persons = require("./PersonsModel");
const Documents = require("./DocumentsModel");

/* -----------------------------
   EXISTING USER / RBAC ASSOCIATIONS
--------------------------------*/
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

/* -----------------------------
   CRIME FOLDER ASSOCIATIONS
--------------------------------*/
// AdministrativeUnit -> CrimeFolders
AdministrativeUnit.hasMany(CrimeFolders, { foreignKey: "administrative_unit_id" });
CrimeFolders.belongsTo(AdministrativeUnit, { foreignKey: "administrative_unit_id" });

// User -> CrimeFolders (creator)
User.hasMany(CrimeFolders, { foreignKey: "created_by" });
CrimeFolders.belongsTo(User, { foreignKey: "created_by" });

// CrimeFolders -> Documents
CrimeFolders.hasMany(Documents, { foreignKey: "crime_id" });
Documents.belongsTo(CrimeFolders, { foreignKey: "crime_id" });

// AdministrativeUnit -> Documents
AdministrativeUnit.hasMany(Documents, { foreignKey: "administrative_unit_id" });
Documents.belongsTo(AdministrativeUnit, { foreignKey: "administrative_unit_id" });

// User -> Documents (uploader)
User.hasMany(Documents, { foreignKey: "uploaded_by" });
Documents.belongsTo(User, { foreignKey: "uploaded_by" });

// CrimeFolders -> Persons
CrimeFolders.hasMany(Persons, { foreignKey: "crime_id" });
Persons.belongsTo(CrimeFolders, { foreignKey: "crime_id" });

module.exports = {
  User,
  AdministrativeUnit,
  Role,
  Permission,
  UserAssignment,
  UserPermission,
  AuditLog,
  CrimeFolders,
  Persons,
  Documents,
};
