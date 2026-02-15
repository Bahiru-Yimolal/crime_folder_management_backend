// services/city.service.js
const AdministrativeUnit = require("../models/administrativeUnitModel");
const Role = require("../models/roleModel");
const { AppError } = require("../middlewares/errorMiddleware");
const { Op } = require("sequelize");
const { assignUserToUnit } = require("./assignnmentService");
const { UserAssignment, User, Permission, UserPermission, Service, ServiceAssignment, ServiceRequest } = require("../models");
const sequelize = require("../config/database");

const createCityService = async (name, user) => {
  try {


    // Check for duplicate city
    const existingCity = await AdministrativeUnit.findOne({
      where: { name, level: "CITY", parent_id: user.unit.id },
    });

    if (existingCity) {
      throw new AppError("City with this name already exists", 400);
    }

    // Create the city
    const newCity = await AdministrativeUnit.create({
      name,
      level: "CITY",
      parent_id: user.unit.id, // Ethiopia unit id
    });

    return newCity;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Database error: Unable to create city", 500);
  }
};

const listCitiesService = async () => {
  try {

    const cities = await AdministrativeUnit.findAll({
      where: { level: "CITY" },
      include: [
        {
          model: UserAssignment,
          required: false, // ensures cities without admins are still returned
          include: [
            {
              model: User,
              attributes: ["user_id", "first_name", "last_name", "email", "phone_number", "status"],
            }
          ],
        },
      ],
    });

    return cities;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Database error: Unable to fetch cities", 500);
  }
};

const updateCityService = async (cityId, name) => {
  try {


    const city = await AdministrativeUnit.findOne({
      where: { id: cityId, level: "CITY" },
    });

    if (!city) throw new AppError("City not found", 404);



    // Check for duplicate name
    const duplicate = await AdministrativeUnit.findOne({
      where: { name, level: "CITY", id: { [Op.ne]: cityId } },
    });

    if (duplicate) throw new AppError("Another city with this name exists", 400);

    city.name = name;
    await city.save();

    return city;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Database error: Unable to update city", 500);
  }
};

const deleteCityService = async (cityId, user) => {
  try {

    const city = await AdministrativeUnit.findOne({
      where: { id: cityId, level: "CITY", parent_id: user.unit.id },
    });

    if (!city) throw new AppError("City not found", 404);

    // Check for sub-cities
    const subCityCount = await AdministrativeUnit.count({
      where: { parent_id: city.id },
    });

    if (subCityCount > 0) {
      throw new AppError(
        "Cannot delete city with sub-cities. Delete sub-cities first.",
        400
      );
    }

    await city.destroy();

    return true;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Database error: Unable to delete city", 500);
  }
};

const assignCityAdminService = async ({
  userId,
  cityId,
  permissions = null,
  currentUser,
}) => {

  // 2️⃣ Validate city
  const city = await AdministrativeUnit.findByPk(cityId);
  if (!city || city.level !== "CITY") {
    throw new AppError("Invalid CITY ID", 400);
  }

  // 3️⃣ Fetch ADMIN role
  const [adminRole] = await Role.findOrCreate({
    where: { name: "ADMIN" },
    defaults: { description: "Admin role" },
  });


  // 4️⃣ Assign user
  const assignment = await assignUserToUnit({
    userId,
    unitId: city.id,
    roleId: adminRole.id,
    permissions, // ← OPTIONAL (can be null or array)
  });

  return assignment;
};

const createEthiopiaLevelUserService = async ({
  userId,
  roleName,
  permissions = null,
  actor,
}) => {


  // 2️⃣ Get Ethiopia unit
  const ethiopiaUnit = await AdministrativeUnit.findOne({
    where: { level: "ETHIOPIA" },
  });

  if (!ethiopiaUnit) {
    throw new AppError("Ethiopia unit not found", 500);
  }

  // 3️⃣ Validate role

  const [role] = await Role.findOrCreate({
    where: { name: roleName },
    defaults: { description: "role created" },
  });

  // 4️⃣ Assign user
  const assignmentResult = await assignUserToUnit({
    userId: userId,
    unitId: ethiopiaUnit.id,
    roleId: role.id,
    permissions, // optional override
  });

  return assignmentResult
};


const updateUserPermissions = async ({ targetUserId, permissions = null }) => {
  const transaction = await sequelize.transaction();

  try {
    // 1️⃣ Find assignment
    const assignment = await UserAssignment.findOne({
      where: { user_id: targetUserId },
      transaction,
    });

    if (!assignment) {
      throw new AppError("User is not assigned", 404);
    }

    // 2️⃣ Find user and role
    const user = await User.findByPk(targetUserId, { transaction });
    const role = await assignment.getRole({ transaction });

    // 4️⃣ Get Permission records
    const perms = await Permission.findAll({
      where: { name: permissions },
      transaction,
    });

    // 5️⃣ Delete existing permissions
    await UserPermission.destroy({
      where: { assignment_id: assignment.id },
      transaction,
    });

    // 6️⃣ Assign new permissions
    await Promise.all(
      perms.map((perm) =>
        UserPermission.create(
          { assignment_id: assignment.id, permission_id: perm.id },
          { transaction }
        )
      )
    );

    await transaction.commit();

    return {
      userId: user.user_id,
      role: role.name,
      permissions: permissions,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateEthiopiaLevelUserService = async ({
  userId,
  roleName,
  permissions = null,
  actor,
}) => {
  const transaction = await sequelize.transaction();

  try {
    // 1️⃣ Get Ethiopia unit
    const ethiopiaUnit = await AdministrativeUnit.findOne({
      where: { level: "ETHIOPIA" },
      transaction,
    });

    if (!ethiopiaUnit) {
      throw new AppError("Ethiopia unit not found", 500);
    }

    // 2️⃣ Get existing assignment
    const assignment = await UserAssignment.findOne({
      where: {
        user_id: userId,
        unit_id: ethiopiaUnit.id,
      },
      transaction,
    });

    if (!assignment) {
      throw new AppError("User is not assigned to Ethiopia level", 404);
    }

    // 3️⃣ Get / create role
    const [role] = await Role.findOrCreate({
      where: { name: roleName },
      defaults: { description: "role created" },
      transaction,
    });

    // 4️⃣ Update role
    assignment.role_id = role.id;
    await assignment.save({ transaction });

    // 5️⃣ Default permissions by role
    const rolePermissions = {
      ADMIN: [
        "CREATE_FOLDER",
        "READ_FOLDER",
        "UPDATE_FOLDER",
        "DELETE_FOLDER",
        "ADMIN_PERMISSIONS",
      ],
      OFFICER: [
        "CREATE_FOLDER",
        "READ_FOLDER",
        "UPDATE_FOLDER",
        "DELETE_FOLDER",
      ],
      ANALYST: ["READ_FOLDER"],
    };

    const permissionNames = permissions || rolePermissions[role.name] || [];

    // 6️⃣ Clear existing permissions
    await UserPermission.destroy({
      where: { assignment_id: assignment.id },
      transaction,
    });

    // 7️⃣ Assign new permissions
    const perms = await Permission.findAll({
      where: { name: permissionNames },
      transaction,
    });

    await Promise.all(
      perms.map((perm) =>
        UserPermission.create(
          {
            assignment_id: assignment.id,
            permission_id: perm.id,
          },
          { transaction }
        )
      )
    );

    await transaction.commit();

    return {
      userId,
      unit: "ETHIOPIA",
      role: role.name,
      permissions: permissionNames,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getPersonnelByRoleService = async ({ unitId, roleName }) => {
  try {
    const assignments = await UserAssignment.findAll({
      where: { unit_id: unitId },
      include: [
        {
          model: Role,
          where: { name: roleName },
          attributes: ["name"]
        },
        {
          model: User,
          attributes: ["user_id", "first_name", "last_name", "email", "phone_number", "status"]
        }
      ]
    });

    return assignments.map(a => a.User);
  } catch (error) {
    throw new AppError("Database error: Unable to fetch personnel", 500);
  }
};

const getUnitPersonnelDetailsService = async (unitId) => {
  try {
    const assignments = await UserAssignment.findAll({
      where: { unit_id: unitId },
      include: [
        {
          model: User,
          attributes: ["user_id", "first_name", "last_name", "email", "phone_number", "status"]
        },
        {
          model: Role,
          attributes: ["id", "name"]
        },
        {
          model: UserPermission,
          include: [
            {
              model: Permission,
              attributes: ["id", "name", "description"]
            }
          ]
        }
      ]
    });

    return assignments.map(a => ({
      ...a.User.toJSON(),
      role: a.Role,
      permissions: a.UserPermissions.map(up => up.Permission)
    }));
  } catch (error) {
    throw new AppError("Database error: Unable to fetch unit personnel details", 500);
  }
};


const getAllPermissionsService = async () => {
  try {
    const permissions = await Permission.findAll({
      order: [["name", "ASC"]],
    });

    return permissions;
  } catch (error) {
    throw new AppError("Database error: Unable to fetch permissions", 500);
  }
};


const getAllRolesService = async () => {
  try {
    const roles = await Role.findAll({
      order: [["name", "ASC"]],
    });

    return roles;
  } catch (error) {
    throw new AppError("Database error: Unable to fetch roles", 500);
  }
};


module.exports = {
  createCityService,
  listCitiesService,
  updateCityService,
  deleteCityService, // Unit delete
  assignCityAdminService,
  createEthiopiaLevelUserService,
  updateUserPermissions,
  updateEthiopiaLevelUserService,
  getAllPermissionsService,
  getAllRolesService,
  getPersonnelByRoleService,
  getUnitPersonnelDetailsService,

};

 