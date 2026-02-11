const express = require("express");
const {
  protect,
  verifySubcityLeader,
} = require("../middlewares/authMiddleware");
const {
  userRegistrationController,
  authUserController,
  getAllUsersController,
  updateUserController,
  updateUserPasswordController,
  getAllUsersWithPendingStatusController,
  getAllUsersWithPendingStatusAdminController,
  getAllUsersWithPendingStatusHeadController,
  resetEmailPasswordController,
  resetPasswordController,
  getAllAdminBySeenController,
  removeIsSeenController,
  sendBulkEmailController,
  getSectorNameController,
  getNumberReportController,
  resetUserPasswordController,
  getPendingUsersBySector
} = require("../controllers/userControllers");
const {
  validateUser,
  validateUserUpdate,
  validatePassword,
  validateLoginInfo,
  validateEmail,
  validateResetPassword,
  validateEmailAttributes,
} = require("../validators/userValidators");


const router = express.Router();




router.route("/").post(validateUser, userRegistrationController);
router.post("/login", validateLoginInfo, authUserController);


// router.route("/sendBulkEmail").post(protect,validateEmailAttributes, sendBulkEmailController);

// router.route("/").get(protect, getAllUsersController);
// router
//   .route("/updateInfo")
//   .patch(protect, validateUserUpdate, updateUserController);
// router
//   .route("/updatePassword")
//   .patch(protect, validatePassword, updateUserPasswordController);
// router
//   .route("/forgot-password")
//   .post(validateEmail, resetEmailPasswordController);
// router
//   .route("/reset-password")
//   .post(protect,validateResetPassword, resetPasswordController);
// router
//   .route("/resetPassword/:phoneNumber")
//   .patch(protect, verifySubcityLeader, resetUserPasswordController);


module.exports = router;
