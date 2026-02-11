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


/**
 * Create a new service with optional group leader assignment
 */
const createService = async ({
  type,
  place,
  duration,
  quality_standard,
  delivery_mode,
  preconditions,
  groupLeaderIds = [],
  actor,
}) => {
  const transaction = await sequelize.transaction();

  try {
    // 0. Check if service with same type already exists in this unit
    const existingService = await Service.findOne({
      where: { type, unit_id: actor.unit.id },
      transaction,
    });

    if (existingService) {
      throw new AppError(`A service with the name "${type}" already exists in your unit.`, 400);
    }

    // 1. Create the Service
    const service = await Service.create(
      {
        type,
        place,
        duration,
        quality_standard,
        delivery_mode,
        preconditions,
        unit_id: actor.unit.id, // Derived from Admin's token
        created_by: actor.id,
      },
      { transaction }
    );

    // 2. If groupLeaderIds are provided, create assignments
    let assignments = [];
    if (groupLeaderIds && groupLeaderIds.length > 0) {
      for (const groupLeaderId of groupLeaderIds) {
        // Optional: Verify if the user is actually a GL in this unit
        const isGL = await UserAssignment.findOne({
          where: { user_id: groupLeaderId, unit_id: actor.unit.id },
          include: [{ model: Role, where: { name: "GROUP_LEADER" } }],
          transaction,
        });

        if (!isGL) {
          throw new AppError(`The provided Group Leader ID ${groupLeaderId} is invalid or not a Group Leader in your unit`, 400);
        }

        const assignment = await ServiceAssignment.create(
          {
            service_id: service.id,
            group_leader_id: groupLeaderId,
            is_active: true,
          },
          { transaction }
        );
        assignments.push(assignment);
      }
    }

    await transaction.commit();

    return {
      service,
      assignments,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Update an existing service and its group leader assignments
 */
const updateService = async (id, {
  type,
  place,
  duration,
  quality_standard,
  delivery_mode,
  preconditions,
  groupLeaderIds,
  actor,
}) => {
  const transaction = await sequelize.transaction();

  try {
    // 1. Find the service
    const service = await Service.findByPk(id, { transaction });
    if (!service) {
      throw new AppError("Service not found", 404);
    }

    // 2. Security Check: Only admins from the same unit (or higher) should update
    if (service.unit_id !== actor.unit.id) {
      throw new AppError("You can only update services within your own unit", 403);
    }

    // 3. Uniqueness Check: If type is being updated, check if new name already exists in this unit
    if (type && type !== service.type) {
      const duplicateService = await Service.findOne({
        where: { type, unit_id: actor.unit.id, id: { [Op.ne]: id } },
        transaction,
      });

      if (duplicateService) {
        throw new AppError(`Another service with the name "${type}" already exists in your unit.`, 400);
      }
    }

    // 4. Update Service Fields
    await service.update(
      {
        type: type || service.type,
        place: place || service.place,
        duration: duration || service.duration,
        quality_standard: quality_standard !== undefined ? quality_standard : service.quality_standard,
        delivery_mode: delivery_mode || service.delivery_mode,
        preconditions: preconditions || service.preconditions,
      },
      { transaction }
    );

    // 5. Update Assignments (if groupLeaderIds is provided)
    let assignments = [];
    if (groupLeaderIds !== undefined) {
      // a. Delete existing assignments
      await ServiceAssignment.destroy({
        where: { service_id: id },
        transaction,
      });

      // b. Create new ones if array is not empty
      if (groupLeaderIds && groupLeaderIds.length > 0) {
        for (const groupLeaderId of groupLeaderIds) {
          // Verify if the user is a GL in this unit
          const isGL = await UserAssignment.findOne({
            where: { user_id: groupLeaderId, unit_id: actor.unit.id },
            include: [{ model: Role, where: { name: "GROUP_LEADER" } }],
            transaction,
          });

          if (!isGL) {
            throw new AppError(`The provided Group Leader ID ${groupLeaderId} is invalid or not a Group Leader in your unit`, 400);
          }

          const assignment = await ServiceAssignment.create(
            {
              service_id: id,
              group_leader_id: groupLeaderId,
              is_active: true,
            },
            { transaction }
          );
          assignments.push(assignment);
        }
      }
    } else {
      // Fetch existing if not updating
      assignments = await ServiceAssignment.findAll({ where: { service_id: id }, transaction });
    }

    await transaction.commit();

    return {
      service,
      assignments,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * List all services within a specific unit with pagination
 */
const listServices = async (unitId, { page = 1, limit = 10 }) => {
  try {
    const offset = (page - 1) * limit;

    const { count, rows } = await Service.findAndCountAll({
      where: { unit_id: unitId },
      include: [
        {
          model: ServiceAssignment,
          include: [
            {
              model: User,
              attributes: ["user_id", "first_name", "last_name", "email", "phone_number"],
            },
          ],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
      distinct: true, // Ensures count is accurate with includes
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      services: rows,
    };
  } catch (error) {
    throw new AppError("Database error: Unable to fetch services", 500);
  }
};

/**
 * Delete a service if it has no associated requests
 */
const deleteServiceLogic = async (id, actor) => {
  const transaction = await sequelize.transaction();

  try {
    // 1. Find the service
    const service = await Service.findByPk(id, { transaction });
    if (!service) {
      throw new AppError("Service not found", 404);
    }

    // 2. Security Check
    if (service.unit_id !== actor.unit.id) {
      throw new AppError("You can only delete services within your own unit", 403);
    }

    // 3. Check for associated requests
    const requestCount = await ServiceRequest.count({
      where: { service_id: id },
      transaction
    });

    if (requestCount > 0) {
      throw new AppError("Cannot delete service: It has associated service requests. Consider deactivating assignments instead.", 400);
    }

    // 4. Delete assignments first
    await ServiceAssignment.destroy({
      where: { service_id: id },
      transaction,
    });

    // 5. Delete the service
    await service.destroy({ transaction });

    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  createCityService,
  listCitiesService,
  updateCityService,
  deleteCityService, // This is the unit delete
  assignCityAdminService,
  createEthiopiaLevelUserService,
  updateUserPermissions,
  updateEthiopiaLevelUserService,
  getAllPermissionsService,
  getAllRolesService,
  getPersonnelByRoleService,
  createService,
  updateService,
  listServices,
  deleteServiceLogic,
};
