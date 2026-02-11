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
  listAssignedServices,
  createServiceRequest,
  listAssignedRequests,
  getServicesByUnitService,
  officerCompleteTask,
  citizenCompleteTask,
  rejectServiceRequest,
  assignRequestToOfficer,
  confirmServiceRequest,
  listCitizenRequests,
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
      paymentAmount,
      completion_metric,
    } = req.body;

    const result = await createService({
      type,
      place,
      duration,
      quality_standard,
      delivery_mode,
      preconditions,
      groupLeaderIds,
      paymentAmount,
      completion_metric,
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
      paymentAmount,
      completion_metric,
      groupLeaderIds,
    } = req.body;

    const result = await updateService(id, {
      type,
      place,
      duration,
      quality_standard,
      delivery_mode,
      preconditions,
      paymentAmount,
      completion_metric,
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

const listAssignedServicesController = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page, limit } = req.query;

    const result = await listAssignedServices(userId, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const createServiceRequestController = async (req, res, next) => {
  try {
    const { service_id, user_phone } = req.body;
    const request = await createServiceRequest({ service_id, user_phone });

    res.status(201).json({
      success: true,
      message: "Service request submitted successfully",
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

const listAssignedRequestsController = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const roleName = req.user.role.name;
    const { page, limit, status } = req.query;

    const result = await listAssignedRequests(userId, roleName, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      status,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getPublicServicesController = async (req, res, next) => {
  try {
    const { unitId } = req.params;
    const services = await getServicesByUnitService(unitId);

    res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};


const officerCompleteTaskController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const request = await officerCompleteTask(id, userId);

    res.status(200).json({
      success: true,
      message: "Task marked as completed by officer",
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

const citizenCompleteTaskController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user_phone } = req.body;
    const request = await citizenCompleteTask(id, user_phone);

    res.status(200).json({
      success: true,
      message: "Task finalized by citizen",
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

const rejectServiceRequestController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rejection_reason } = req.body;
    const userId = req.user.id;

    const request = await rejectServiceRequest(id, userId, rejection_reason);

    res.status(200).json({
      success: true,
      message: "Service request rejected successfully",
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

const assignRequestToOfficerController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { officer_id } = req.body;
    const userId = req.user.id; // Group Leader

    const request = await assignRequestToOfficer(id, userId, officer_id);

    res.status(200).json({
      success: true,
      message: "Task assigned to officer successfully",
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

const confirmServiceRequestController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const request = await confirmServiceRequest(id, userId);

    res.status(200).json({
      success: true,
      message: "Service request confirmed and started successfully",
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

const listCitizenRequestsController = async (req, res, next) => {
  try {
    const { phone, page, limit, status } = req.query;

    const result = await listCitizenRequests(phone, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      status,
    });

    res.status(200).json({
      success: true,
      data: result,
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
  listAssignedServicesController,
  createServiceRequestController,
  listAssignedRequestsController,
  getPublicServicesController,
  officerCompleteTaskController,
  citizenCompleteTaskController,
  rejectServiceRequestController,
  assignRequestToOfficerController,
  confirmServiceRequestController,
  listCitizenRequestsController,
};
