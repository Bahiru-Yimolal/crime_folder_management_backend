const express = require("express");
const { protect, verifyAdmin } = require("../middlewares/authMiddleware");
const {
  createSubcitiesController,
  assignSubcityLeaderController,
  getAllSubcitiesController,
  updateSubcityController,
  unassignSubcityLeaderController,
  getAllSubcityLeadersController,
  resetSubcityLeaderPasswordController,
} = require("../controllers/subcityControllers");

const router = express.Router();

// Route to create a group
router.route("/").post(protect,verifyAdmin,createSubcitiesController);
router.route("/assign").patch(protect, verifyAdmin,assignSubcityLeaderController);
router.route("/").get(protect, verifyAdmin, getAllSubcitiesController);
router
  .route("/allSubcityLeaders")
  .get(protect, verifyAdmin,getAllSubcityLeadersController);
router
  .route("/updateName/:subcity_id")
  .patch(protect, verifyAdmin,updateSubcityController);
router
  .route("/unassign/:user_id")
  .patch(protect, verifyAdmin,unassignSubcityLeaderController);
router.route("/resetPassword").patch(protect, verifyAdmin,resetSubcityLeaderPasswordController);

module.exports = router;
