const sequelize = require("../config/database");
const User = require("../models/userModel");
const UserAssignment = require("../models/userAssignment");
const AdministrativeUnit = require("../models/administrativeUnitModel");
const Role = require("../models/roleModel");
const Permission = require("../models/permissionModel");
const UserPermission = require("../models/userPermissionModel");
const { AppError } = require("../middlewares/errorMiddleware");
const  AuditLog  = require("../models/auditLogModel");


/**
 * Assign a user to a unit with a role
 * ENFORCES single assignment rule
 */
const assignUserToUnit = async ({ userId, unitId, roleId, permissions = null }) => {
  const transaction = await sequelize.transaction();

  try {
    const user = await User.findByPk(userId, { transaction });
    if (!user) throw new AppError("User not found", 404);

    const unit = await AdministrativeUnit.findByPk(unitId, { transaction });
    if (!unit) throw new AppError("Administrative unit not found", 404);

    const role = await Role.findByPk(roleId, { transaction });
    if (!role) throw new AppError("Role not found", 404);

    const existingAssignment = await UserAssignment.findOne({
      where: { user_id: userId },
      transaction,
    });

    if (existingAssignment) {
      throw new AppError("User already assigned. Unassign before reassigning.", 409);
    }

    const assignment = await UserAssignment.create(
      { user_id: userId, unit_id: unitId, role_id: roleId },
      { transaction }
    );

    // default permissions
    const rolePermissions = {
      ADMIN: ["CREATE_CRIME_FOLDER","READ_CRIME_FOLDER","UPDATE_CRIME_FOLDER","DELETE_CRIME_FOLDER","ADMIN_PERMISSIONS"],
      OFFICER: ["CREATE_CRIME_FOLDER","READ_CRIME_FOLDER","UPDATE_CRIME_FOLDER","DELETE_CRIME_FOLDER"],
      ANALYST: ["READ_CRIME_FOLDER"],
    };

    const permissionNames = permissions || rolePermissions[role.name] || [];

    const perms = await Permission.findAll({ where: { name: permissionNames }, transaction });
    await Promise.all(perms.map(perm => UserPermission.create({ assignment_id: assignment.id, permission_id: perm.id }, { transaction })));

    await user.update({ status: "ACTIVE" }, { transaction });

    await transaction.commit();

    return { assignment, user: { id: user.user_id, status: user.status }, unit: { id: unit.id, level: unit.level }, role: { id: role.id, name: role.name } };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Unassign user (required before reassignment)
 */
const unassignUser = async ({ targetUserId, performedBy }) => {
  const transaction = await sequelize.transaction();

  try {
    // 1️⃣ Get target assignment
    const assignment = await UserAssignment.findOne({
      where: { user_id: targetUserId },
      transaction,
    });

    if (!assignment) {
      throw new AppError("User is not assigned", 404);
    }

    // 2️⃣ Prevent unassigning Ethiopia Super Admin
    if (
      assignment.unit_id === performedBy.unit.id &&
      performedBy.unit.level === "ETHIOPIA" &&
      performedBy.role.name === "ADMIN" &&
      targetUserId === performedBy.id
    ) {
      throw new AppError("Cannot unassign the Ethiopia Super Admin", 403);
    }

    // 3️⃣ Remove user permissions
    await UserPermission.destroy({
      where: { assignment_id: assignment.id },
      transaction,
    });

    // 4️⃣ Remove assignment
    await assignment.destroy({ transaction });

    // 5️⃣ Set user status back to UNASSIGNED
    await User.update(
      { status: "UNASSIGNED" },
      { where: { user_id: targetUserId }, transaction }
    );

    // 6️⃣ Audit log
    await AuditLog.create(
      {
        user_id: performedBy.id,
        unit_id: performedBy.unit.id,
        action: "UNASSIGN_USER",
        target_id: targetUserId,
        metadata: {
          previous_assignment_id: assignment.id,
        },
      },
      { transaction }
    );

    await transaction.commit();

    return {
      message: "User unassigned successfully",
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};


module.exports = {
  assignUserToUnit,
  unassignUser,
};
