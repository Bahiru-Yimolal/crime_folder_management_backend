const express = require("express");
const {
  createWorkController,
  getWorkHistoryController,
  deleteWorkHistoryController,
  updateWorkHistoryController,
  getSectorWorkHistoryController,
  getAllWorkHistoryController,
  generateTrainingReportController,
  generateSectorTrainingReportController,

} = require("../controllers/workControllers");

const {
  validateWork,
  validateUpdateWork,
} = require("../validators/profileValidators");

const {
  protect,
  verifySectorLeader,
  verifyUserRole,
} = require("../middlewares/authMiddleware");

const { upload } = require("../middlewares/uploadMiddleware");

// Upload multiple named fields
const uploadFields = upload.fields([{ name: "certificate", maxCount: 1 }]);

const router = express.Router();

router
  .route("/")
  .post(
    protect,
    uploadFields,
    validateWork,
    createWorkController
  );
router.route("/:profile_id").get(protect, getWorkHistoryController);
router.route("/admin/sector").get(protect,verifySectorLeader, getSectorWorkHistoryController);
router.route("/").get(protect, getAllWorkHistoryController);
router.route("/:work_history_id").put(
  protect,
  uploadFields,
  validateUpdateWork, // Optional: create separate Joi validation for updates
  updateWorkHistoryController
);

router
  .route("/:work_history_id")
  .delete(protect, deleteWorkHistoryController);
router
  .route("/trainingReport/:isComplete/:startDate/:endDate")
  .get(protect, generateTrainingReportController);
router
  .route("/sector/trainingReport/:isComplete/:startDate/:endDate")
  .get(protect, generateSectorTrainingReportController);

module.exports = router;
