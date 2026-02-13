const AdministrativeUnit = require("../models/administrativeUnitModel");
const User = require("../models/userModel");
const Role = require("../models/roleModel");
const Permission = require("../models/permissionModel");
const UserPermission = require("../models/userPermissionModel");
const UserAssignment = require("../models/userAssignment");        
const sequelize = require("../config/database");
const { AppError } = require("../middlewares/errorMiddleware");
const { assignUserToUnit } = require("./assignnmentService"); // Correct import path

// 1. Create a Sector
const createSectorService = async (name, user) => {
  // Ensure the user is a SUBCITY Admin
  if (!user || !user.unit || user.unit.level !== "SUBCITY") {
    throw new AppError("Only SUBCITY Admins can create sectors", 403);
  }

  // Check if sector with the same name exists UNDER THE SAME SUBCITY
  const existingSector = await AdministrativeUnit.findOne({
    where: {
      name,
      level: "SECTOR",
      parent_id: user.unit.id, // Must be unique within the subcity
    },
  });

  if (existingSector) {
    throw new AppError("Sector with this name already exists in your subcity", 400);
  }

  // Create the Sector
  const newSector = await AdministrativeUnit.create({
    name,
    level: "SECTOR",
    parent_id: user.unit.id, // Parent is the current SUBCITY
  });

  return newSector;
};

// 2. List Sectors (for the logged-in SUBCITY Admin)
async function listSectorsService(user) {
  try {
    let whereClause = { level: "SECTOR" };

    // If logged in as SUBCITY Admin, only show their sectors
    if (user.unit.level === "SUBCITY") {
      whereClause.parent_id = user.unit.id;
    }
    // If logged in as CITY/ETHIOPIA Admin, they might need broader access, 
    // but per requirements "It should be done by the subcity admin", 
    // so we assume restricted view is primary. 
    // However, higher levels *should* probably see them too, but let's stick to the SUBCITY context.

    const sectors = await AdministrativeUnit.findAll({
      where: whereClause,
      include: [
        {
          model: UserAssignment,
          required: false,
          include: [
            {
              model: User,
              attributes: ["user_id", "first_name", "last_name", "email", "phone_number", "status"],
            },
            {
              model: Role,
              where: { name: "SECTOR_ADMIN" }, // Filter for Sector Admins
              required: false // Allow sectors without admins to be listed
            },
          ],
        },
      ],
    });
    return sectors;
  } catch (error) {
    throw new AppError(error.message, 500);
  }
}

// 3. Update Sector
const updateSectorService = async (id, name, user) => {
  // Find sector
  const sector = await AdministrativeUnit.findOne({
    where: { id, level: "SECTOR" },
  });

  if (!sector) {
    throw new AppError("Sector not found", 404);
  }

  // Check permission: Must be the SUBCITY Admin of the parent subcity
  if (user.unit.level === "SUBCITY") {
    if (sector.parent_id !== user.unit.id) {
      throw new AppError("You can only update sectors within your subcity", 403);
    }
  }

  // Check for Duplicate Name within the same subcity (excluding self)
  const existingSector = await AdministrativeUnit.findOne({
    where: {
      name,
      level: "SECTOR",
      parent_id: sector.parent_id,
    },
  });

  if (existingSector && existingSector.id !== id) {
    throw new AppError("Another sector with this name already exists in this subcity", 400);
  }

  sector.name = name;
  await sector.save();

  return sector;
};

// 4. Delete Sector
const deleteSectorService = async (id, user) => {
  const sector = await AdministrativeUnit.findOne({
    where: { id, level: "SECTOR" },
  });

  if (!sector) {
    throw new AppError("Sector not found", 404);
  }

  // Check permission
  if (user.unit.level === "SUBCITY") {
    if (sector.parent_id !== user.unit.id) {
      throw new AppError("You can only delete sectors within your subcity", 403);
    }
  }

  // Check if there are children (e.g. Committees? not implemented yet but good practice check)
  // For now assuming no further nested levels or using a generic check if needed.
  // AdministrativeUnit doesn't have children relation defined in model export but implies hierarchy.
  // We'll skip child check for now unless requested or if 'Committee' becomes a level.
  // Wait, the prompt implies "const sectorRoutes = require("./routes/sectorRoutes");" 
  // The previous code had committees. If committees are next, we should probably check.
  // But for now, let's just delete using standard logic.

  await sector.destroy();
  return { message: "Sector deleted successfully" };
};

// 5. Assign Sector Admin
const assignSectorAdminService = async ({
  userId,
  sectorId,
  permissions = null,
  currentUser,
}) => {
  // 1. Validate Sector
  const sector = await AdministrativeUnit.findByPk(sectorId);
  if (!sector || sector.level !== "SECTOR") {
    throw new AppError("Invalid SECTOR ID", 400);
  }

  // 2. Ensure current user is the parent SUBCITY Admin
  if (currentUser.unit.level === "SUBCITY") {
    if (sector.parent_id !== currentUser.unit.id) {
      throw new AppError("You can only assign admins to sectors within your subcity", 403);
    }
  }

  // 3. Fetch/Create SECTOR_ADMIN role
  const [adminRole] = await Role.findOrCreate({
    where: { name: "ADMIN" },
    defaults: { description: "Sector Admin role" },
  });

  // 4. Assign user
  const assignment = await assignUserToUnit({
    userId,
    unitId: sector.id,
    roleId: adminRole.id,
    permissions,
  });

  return assignment;
};



// 6. Create Sector Level User
const createSectorLevelUserService = async ({
  userId,
  roleName,
  permissions = null,
  actor,
}) => {

  if (actor.unit.level !== "SUBCITY") {
    throw new AppError("Only SUBCITY Admins can create sector level users", 403);
  }

  const [role] = await Role.findOrCreate({
    where: { name: roleName },
    defaults: { description: "Sector level role" },
  });

  const assignment = await assignUserToUnit({
    userId,
    unitId: actor.unit.id,
    roleId: role.id,
    permissions,
  });

  return assignment;
};

// 7. Update Sector Level User
const updateSectorLevelUserService = async ({
  userId,
  roleName,
  permissions = null,
  actor,
}) => {
  if (actor.unit.level !== "SUBCITY") {
    throw new AppError("Only SUBCITY Admins can update sector level users", 403);
  }

  const transaction = await sequelize.transaction();

  try {
    const assignment = await UserAssignment.findOne({
      where: { user_id: userId, unit_id: actor.unit.id },
      transaction,
    });

    if (!assignment) {
      throw new AppError("User is not assigned to your sector", 404);
    }

    if (roleName) {
      const [role] = await Role.findOrCreate({
        where: { name: roleName },
        defaults: { description: "Sector level role" },
        transaction
      });
      if (assignment.role_id !== role.id) {
        assignment.role_id = role.id;
        await assignment.save({ transaction });
      }
    }

    await UserPermission.destroy({
      where: { assignment_id: assignment.id },
      transaction,
    });

    if (permissions && permissions.length > 0) {
      const perms = await Permission.findAll({
        where: { name: permissions },
        transaction,
      });

      await Promise.all(
        perms.map((perm) =>
          UserPermission.create(
            { assignment_id: assignment.id, permission_id: perm.id },
            { transaction }
          )
        )
      );
    }

    await transaction.commit();

    return {
      userId,
      role: roleName,
      permissions,
      message: "User updated successfully"
    };

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};



// 8. Create Own Sector User (Sector Admin managing their own sector)
const createOwnSectorUserService = async ({
  userId,
  roleName,
  permissions = null,
  actor,
}) => {
  // Ensure actor is a SECTOR Admin
  if (actor.unit.level !== "SECTOR") {
    throw new AppError("Only SECTOR Admins can manage users within their own sector via this endpoint", 403);
  }

  // Find or Create Role
  const [role] = await Role.findOrCreate({
    where: { name: roleName },
    defaults: { description: "Sector level role" },
  });

  // Assign user to the actor's OWN sector
  const assignment = await assignUserToUnit({
    userId,
    unitId: actor.unit.id, // Current Sector ID of the Admin
    roleId: role.id,
    permissions,
  });

  return assignment;
};

// 9. Update Own Sector User (Sector Admin managing their own sector)
const updateOwnSectorUserService = async ({
  userId,
  roleName,
  permissions = null,
  actor,
}) => {
  // Ensure actor is a SECTOR Admin
  if (actor.unit.level !== "SECTOR") {
    throw new AppError("Only SECTOR Admins can update users within their own sector via this endpoint", 403);
  }

  const transaction = await sequelize.transaction();

  try {
    // 1. Find assignment to ensure user is in THIS sector
    const assignment = await UserAssignment.findOne({
      where: { user_id: userId, unit_id: actor.unit.id },
      transaction,
    });

    if (!assignment) {
      throw new AppError("User is not assigned to your sector", 404);
    }

    // 2. Update Role if provided and different
    if (roleName) {
      const [role] = await Role.findOrCreate({
        where: { name: roleName },
        defaults: { description: "Sector level role" },
        transaction
      });
      if (assignment.role_id !== role.id) {
        assignment.role_id = role.id;
        await assignment.save({ transaction });
      }
    }

    // 3. Update Permissions
    // Delete existing
    await UserPermission.destroy({
      where: { assignment_id: assignment.id },
      transaction,
    });

    // Assign new
    if (permissions && permissions.length > 0) {
      const perms = await Permission.findAll({
        where: { name: permissions },
        transaction,
      });

      await Promise.all(
        perms.map((perm) =>
          UserPermission.create(
            { assignment_id: assignment.id, permission_id: perm.id },
            { transaction }
          )
        )
      );
    }

    await transaction.commit();

    return {
      userId,
      role: roleName,
      permissions,
      message: "User updated successfully"
    };

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  createSectorService,
  listSectorsService,
  updateSectorService,
  deleteSectorService,
  assignSectorAdminService,
  createSectorLevelUserService,
  updateSectorLevelUserService,
  createOwnSectorUserService,
  updateOwnSectorUserService,
};
