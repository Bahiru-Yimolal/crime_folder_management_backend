const express = require("express");
const {
  createSectorConroller,
  assignSectorLeaderController,
  getAllSectorsController,
  updateSectorNameController,
  unassignSectorLeaderController,
  resetSectorLeaderPasswordController,
  getAllSectorLeadersController,
} = require("../controllers/sectorControllers");
const {
  validateSectorInput,
    validateAssignSectorLeader,
  validateSectorName,
} = require("../validators/sectorValidators");

const {
  protect,
  verifySubcityLeader,
} = require("../middlewares/authMiddleware");

const   router = express.Router();

// Route to create a group
router
  .route("/")
  .post(
    protect,
    verifySubcityLeader,
    validateSectorInput,
    createSectorConroller
  );
router
  .route("/assign/")
  .patch(
    protect,
    verifySubcityLeader,
    validateAssignSectorLeader,
    assignSectorLeaderController
  );
router.route("/").get(protect, verifySubcityLeader, getAllSectorsController);
router
  .route("/updateName/:sector_id")
  .patch(
    protect,
    verifySubcityLeader,
    validateSectorName,
    updateSectorNameController
  );
router
  .route("/unassign/:user_id")
  .patch(protect, verifySubcityLeader, unassignSectorLeaderController);

router
  .route("/resetPassword")
  .patch(protect, verifySubcityLeader, resetSectorLeaderPasswordController);

router
  .route("/allSectorLeaders")
  .get(protect, verifySubcityLeader, getAllSectorLeadersController);


module.exports = router;
