const express = require("express");
const {
  createPlanController,
  getPlanController,
  updatePlanController,
  getUnseenPlanController,
  rejectPlanController,
  acceptPlanController,
} = require("../controllers/planControllers");


const {
  protect,
  verifySubcityLeader,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router
    .route("/")
    .post(
      protect,
      createPlanController
    );

router
  .route("/")
  .get(protect,getPlanController);

router.route("/").put(protect, updatePlanController);
router.route("/unseen").get(protect,verifySubcityLeader, getUnseenPlanController);
router
  .route("/reject/:id")
  .put(protect, verifySubcityLeader, rejectPlanController);
router
    .route("/accept/:id")
    .put(protect, verifySubcityLeader, acceptPlanController);





module.exports = router;
