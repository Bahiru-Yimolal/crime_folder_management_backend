const express = require("express");
const {
  protect,
  assignmentMiddleware,
  levelGuard,
  permissionMiddleware,
} = require("../middlewares/authMiddleware");

const {
  validateSectorInput,
  validateAssignSectorAdminInput,
  validateCreateSectorUserInput
} = require("../validators/sectorValidators");

const {
  createSectorController,
  listSectorsController,
  updateSectorController,
  deleteSectorController,
  assignSectorAdminController,
  createSectorLevelUserController,
  updateSectorLevelUserController,
  createOwnSectorUserController,
  updateOwnSectorUserController,
} = require("../controllers/sectorControllers");

const   router = express.Router();

// Create Sector
router.post(
  "/",
  protect,
  assignmentMiddleware,
  levelGuard(["SUBCITY"]), // Only Subcity Admins can create sectors
  permissionMiddleware("ADMIN_PERMISSIONS"), // Or specific CREATE_SECTOR permission
  validateSectorInput,
  createSectorController
);

// List Sectors
router.get(
  "/",
  protect,
  assignmentMiddleware,
  levelGuard(["SUBCITY"]), // Only Subcity Admins can view *their* sectors via this route
  permissionMiddleware("ADMIN_PERMISSIONS"), // Or READ_SECTOR
  listSectorsController
);

// Update Sector
router.put(
  "/:id",
  protect,
  assignmentMiddleware,
  levelGuard(["SUBCITY"]),
  permissionMiddleware("ADMIN_PERMISSIONS"),
  validateSectorInput,
  updateSectorController
);

// Delete Sector
router.delete(
  "/:id",
  protect,
  assignmentMiddleware,
  levelGuard(["SUBCITY"]),
  permissionMiddleware("ADMIN_PERMISSIONS"),
  deleteSectorController
);

// Assign Sector Admin
router.post(
  "/assign/sector-admin",
  protect,
  assignmentMiddleware,
  levelGuard(["SUBCITY"]), // Only Subcity Admin can assign
  permissionMiddleware("ADMIN_PERMISSIONS"),
  validateAssignSectorAdminInput,
  assignSectorAdminController
);

// Assign Sector Level User
router.post(
  "/assign/users",
  protect,
  assignmentMiddleware,
  levelGuard(["SUBCITY"]), // Only SUBCITY Admins
  permissionMiddleware("ADMIN_PERMISSIONS"),
  validateCreateSectorUserInput,
  createSectorLevelUserController
);

// Update Sector Level User
router.put(
  "/assign/users",
  protect,
  assignmentMiddleware,
  levelGuard(["SUBCITY"]),
  permissionMiddleware("ADMIN_PERMISSIONS"),
  validateCreateSectorUserInput,
  updateSectorLevelUserController
);

// Sector Admin matching their OWN sector management
router.post(
  "/assign/own-users",
  protect,
  assignmentMiddleware,
  levelGuard(["SECTOR"]),
  permissionMiddleware("ADMIN_PERMISSIONS"),
  validateCreateSectorUserInput,
  createOwnSectorUserController
);

router.put(
  "/assign/own-users",
  protect,
  assignmentMiddleware,
  levelGuard(["SECTOR"]),
  permissionMiddleware("ADMIN_PERMISSIONS"),
  validateCreateSectorUserInput,
  updateOwnSectorUserController
);

module.exports = router;
