// controllers/city.controller.js
const { unassignUser } = require("../services/assignnmentService");
const {
  createCityService,
  listCitiesService,
  updateCityService,
  deleteCityService,
  assignCityAdminService,
  createEthiopiaLevelUserService,
  updateEthiopiaLevelUserService,
  updateUserPermissions,
  getAllPermissionsService,
  getAllRolesService,
  createService,
  updateService,
  listServices,
  deleteServiceLogic,
  getPersonnelByRoleService } = require("../services/cityService");



const createCityController = async (req, res, next) => {
  try {
    const { name } = req.body;

    // Call the service
    const newCity = await createCityService(name, req.user);

    res.status(201).json({
      success: true,
      message: "City created successfully",
      city: newCity,
    });
  } catch (error) {
    next(error);
  }
};

const listCitiesController = async (req, res, next) => {
  try {
    const cities = await listCitiesService();

    res.status(200).json({
      success: true,
      cities,
    });
  } catch (error) {
    next(error);
  }
};

const updateCityController = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { id } = req.params;



    const updatedCity = await updateCityService(id, name);

    res.status(200).json({
      success: true,
      message: "City updated successfully",
      city: updatedCity,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCityController = async (req, res, next) => {
  try {
    const { id } = req.params;

    await deleteCityService(id, req.user);

    res.status(200).json({
      success: true,
      message: "City deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


const assignCityAdminController = async (req, res, next) => {
  try {
    const { userId, cityId, permissions } = req.body;

    const assignment = await assignCityAdminService({
      userId,
      cityId,
      permissions,   // OPTIONAL
      currentUser: req.user,
    });

    res.status(201).json({
      success: true,
      message: "City Admin assigned successfully",
      assignment,
    });
  } catch (error) {
    next(error);
  }
};

const createEthiopiaLevelUserController = async (req, res, next) => {
  try {
    const { user_id, role, permissions } = req.body;

    const result = await createEthiopiaLevelUserService({
      userId: user_id,
      roleName: role,
      permissions,
      actor: req.user,
    });

    res.status(200).json({
      success: true,
      message: "User assigned to Ethiopia level successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const unassignUserController = async (req, res, next) => {
  try {
    const { userId } = req.body;

    console.log(req.user)

    const result = await unassignUser({
      targetUserId: userId,
      performedBy: req.user,
    });

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserPermissionsController = async (req, res, next) => {
  try {
    const { userId, permissions } = req.body;

    const result = await updateUserPermissions({
      targetUserId: userId,
      permissions,
    });

    res.status(200).json({
      success: true,
      message: "User permissions updated successfully",
      user: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateEthiopiaLevelUserController = async (req, res, next) => {
  try {
    const { user_id, role, permissions } = req.body;

    const result = await updateEthiopiaLevelUserService({
      userId: user_id,
      roleName: role,
      permissions,
      actor: req.user,
    });

    res.status(200).json({
      success: true,
      message: "User role and permissions updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllPermissionsController = async (req, res, next) => {
  try {
    const permissions = await getAllPermissionsService();

    res.status(200).json({
      success: true,
      data: permissions,
    });
  } catch (error) {
    next(error);
  }
};


const getAllRolesController = async (req, res, next) => {
  try {
    const roles = await getAllRolesService();

    res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (error) {
    next(error);
  }
};



const getPersonnelByRoleController = async (req, res, next) => {
  try {
    const { role } = req.query; // Allow choosing role, or default to GROUP_LEADER
    const roleName = role || "GROUP_LEADER";

    // Extract unit_id from the authenticated user's token
    const unitId = req.user.unit.id;

    const personnel = await getPersonnelByRoleService({
      unitId,
      roleName: roleName
    });

    res.status(200).json({
      success: true,
      data: personnel,
    });
  } catch (error) {
    next(error);
  }
};

const createServiceController = async (req, res, next) => {
  try {
    const {
      type,
      place,
      duration,
      quality_standard,
      delivery_mode,
      preconditions,
      groupLeaderIds,
    } = req.body;

    const result = await createService({
      type,
      place,
      duration,
      quality_standard,
      delivery_mode,
      preconditions,
      groupLeaderIds,
      actor: req.user,
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateServiceController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      type,
      place,
      duration,
      quality_standard,
      delivery_mode,
      preconditions,
      groupLeaderIds,
    } = req.body;

    const result = await updateService(id, {
      type,
      place,
      duration,
      quality_standard,
      delivery_mode,
      preconditions,
      groupLeaderIds,
      actor: req.user,
    });

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const listServicesController = async (req, res, next) => {
  try {
    const unitId = req.user.unit.id;
    const { page, limit } = req.query;

    const result = await listServices(unitId, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteServiceController = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteServiceLogic(id, req.user);

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCityController,
  listCitiesController,
  updateCityController,
  deleteCityController, // Unit delete
  assignCityAdminController,
  createEthiopiaLevelUserController,
  unassignUserController,
  updateUserPermissionsController,
  updateEthiopiaLevelUserController,
  getAllPermissionsController,
  getAllRolesController,
  getPersonnelByRoleController,
  createServiceController,
  updateServiceController,
  listServicesController,
  deleteServiceController,
};
