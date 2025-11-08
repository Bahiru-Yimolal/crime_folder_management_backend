const express = require("express");
const {
  createCommitteeConroller,
  assignCommitteeController,
  getAllCommitteController,
  updateCommitteeNameController,
  unassignCommitteeController,
  getAllCommitteeLeadersController,
  resetCommitteeLeaderPasswordController,
  createAttendanceController,
} = require("../controllers/committeeControllers");
const {
  validateCommitteInput,
  validateAssignCommittee,
  validateUpdateCommitteInput,
  validateAttendanceInput,
} = require("../validators/sectorValidators");

const { protect, verifySubcityLeader } = require("../middlewares/authMiddleware");

const router = express.Router();

// Route to create a group
router
  .route("/")
  .post(
    protect,
    verifySubcityLeader,
    validateCommitteInput,
    createCommitteeConroller
  );
router
  .route("/create-attencance")
  .post(
    protect,
    validateAttendanceInput,
    createAttendanceController
  );
router
  .route("/assign/")
  .patch(
    protect,
    verifySubcityLeader,
    validateAssignCommittee,
    assignCommitteeController
  );
router.route("/:sector_id").get(protect, verifySubcityLeader, getAllCommitteController);
router
  .route("/updateName/:committee_id")
  .patch(
    protect,
    verifySubcityLeader,
    validateUpdateCommitteInput,
    updateCommitteeNameController
  );
router
  .route("/unassign/:user_id")
  .patch(protect, verifySubcityLeader, unassignCommitteeController);

router
  .route("/resetPassword")
  .patch(protect, verifySubcityLeader, resetCommitteeLeaderPasswordController);

router
  .route("/allCommitteeLeaders")
  .get(protect, verifySubcityLeader, getAllCommitteeLeadersController);

module.exports = router;
