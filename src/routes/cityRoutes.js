const express = require("express");
const {
  createCityController,
  listCitiesController,
  updateCityController,
  deleteCityController,
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
  rejectServiceRequestController,
  assignRequestToOfficerController,
  confirmServiceRequestController,
  listCitizenRequestsController,
  officerCompleteTaskController,
  citizenCompleteTaskController,
} = require("../controllers/cityControllers");
const {
  validateCityInput,
  validateAssignUserInput,
  validateCreateEthiopiaUserInput,
  validateUnassignUserInput,
  validateUpdatePermissionsInput,
  validateCreateServiceInput,
  validateUpdateServiceInput,
  validateCreateServiceRequestInput,
  validateRejectServiceRequestInput,
  validateAssignRequestToOfficerInput,
  validateAssignedRequestsQuery,
  validateCitizenRequestsQuery,
} = require("../validators/cityValidators");

const { protect, assignmentMiddleware, levelGuard, permissionMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  assignmentMiddleware,
  levelGuard(["ETHIOPIA"]), // ensures user is Ethiopia-level
  permissionMiddleware("ADMIN_PERMISSIONS"),
  validateCityInput, // optional: validate name, etc.
  createCityController
);
router.get(
  "/",
  protect,
  assignmentMiddleware,
  levelGuard(["ETHIOPIA"]), // Only Ethiopia-level
  permissionMiddleware("ADMIN_PERMISSIONS"),
  listCitiesController
);

router.put(
  "/:id",
  protect,
  assignmentMiddleware,
  levelGuard(["ETHIOPIA"]),
  permissionMiddleware("ADMIN_PERMISSIONS"), // Or CREATE_CITY if preferred
  validateCityInput,
  updateCityController
);

router.delete(
  "/:id",
  protect,
  assignmentMiddleware,
  levelGuard(["ETHIOPIA"]),
  permissionMiddleware("ADMIN_PERMISSIONS"),
  deleteCityController
);

router.post(
  "/assign/city-admin",
  protect,
  assignmentMiddleware,
  levelGuard(["ETHIOPIA"]), // only Ethiopia-level Super Admin
  permissionMiddleware("ADMIN_PERMISSIONS"), // must have manage users permission
  validateAssignUserInput, // validate { userId, cityId }
  assignCityAdminController
);


router.post(
  "/assign/users",
  protect,
  assignmentMiddleware,
  levelGuard(["ETHIOPIA"]),
  permissionMiddleware("ADMIN_PERMISSIONS"),
  validateCreateEthiopiaUserInput,
  createEthiopiaLevelUserController
);

router.put(
  "/assign/users",
  protect,
  assignmentMiddleware,
  levelGuard(["ETHIOPIA"]),
  permissionMiddleware("ADMIN_PERMISSIONS"),
  validateCreateEthiopiaUserInput, // same validator ✔
  updateEthiopiaLevelUserController
);


router.delete(
  "/users/unassign",
  protect,
  assignmentMiddleware,
  permissionMiddleware("ADMIN_PERMISSIONS"), // only users with MANAGE_USERS can unassign
  validateUnassignUserInput,
  unassignUserController
);

router.put(
  "/users/permissions",
  protect,
  assignmentMiddleware,
  permissionMiddleware("ADMIN_PERMISSIONS"),
  validateUpdatePermissionsInput,
  updateUserPermissionsController
);

router.get(
  "/permissions",
  protect,
  assignmentMiddleware,
  permissionMiddleware("ADMIN_PERMISSIONS"),
  getAllPermissionsController
);

router.get(
  "/roles",
  protect,
  assignmentMiddleware,
  permissionMiddleware("ADMIN_PERMISSIONS"),
  getAllRolesController
);
router.get(
  "/services",
  protect,
  assignmentMiddleware,
  listServicesController
);

// Public Service Discovery (for QR scanning start)
router.get(
  "/services/public/:unitId",
  getPublicServicesController
);


router.get(
  "/services/assigned",
  protect,
  assignmentMiddleware,
  listAssignedServicesController
);

router.get(
  "/services/requests/citizen",
  validateCitizenRequestsQuery,
  listCitizenRequestsController
);

// Citizen Service Request Initiation (Public)
router.post(
  "/services/request",
  validateCreateServiceRequestInput,
  createServiceRequestController
);

router.get(
  "/services/requests/assigned",
  protect,
  assignmentMiddleware,
  validateAssignedRequestsQuery,
  listAssignedRequestsController
);

// Task Completion
router.put(
  "/services/requests/:id/officer-complete",
  protect,
  assignmentMiddleware,
  officerCompleteTaskController
);

router.patch(
  "/services/requests/:id/citizen-complete",
  validateCreateServiceRequestInput, // Reusing phone validator
  citizenCompleteTaskController
);

router.patch(
  "/services/requests/:id/reject",
  protect,
  assignmentMiddleware,
  validateRejectServiceRequestInput,
  rejectServiceRequestController
);

router.patch(
  "/services/requests/:id/assign",
  protect,
  assignmentMiddleware,
  validateAssignRequestToOfficerInput,
  assignRequestToOfficerController
);

router.patch(
  "/services/requests/:id/confirm",
  protect,
  assignmentMiddleware,
  confirmServiceRequestController
);

router.post(
  "/services",
  protect,
  assignmentMiddleware,
  validateCreateServiceInput,
  createServiceController
);

router.put(
  "/services/:id",
  protect,
  assignmentMiddleware,
  validateUpdateServiceInput,
  updateServiceController
);

router.delete(
  "/services/:id",
  protect,
  assignmentMiddleware,
  deleteServiceController
);

// Personnel Fetching (Group Leaders, Officers, etc. within the unit)
router.get(
  "/personnel",
  protect,
  assignmentMiddleware,
  getPersonnelByRoleController
);

module.exports = router;
