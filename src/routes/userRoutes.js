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
  adminRegistrationController,
  headRegistrationController,
  superAdminRegistrationController,
  getAllUsersWithPendingStatusAdminController,
  getAllUsersWithPendingStatusHeadController,
  superRegistrationController,
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





// router.route("/superAdmin").post(validateUser, superAdminRegistrationController);
// router.route("/").post(validateUser, userRegistrationController);
// router.route("/admin").post(validateUser, adminRegistrationController);
// router.route("/head").post(validateUser, headRegistrationController);
// // router.route("/we").post(validateUser, weRegistrationController);
// router.route("/super").post(validateUser, superRegistrationController);

// router.route("/sendBulkEmail").post(protect,validateEmailAttributes, sendBulkEmailController);

// router.route("/").get(protect, getAllUsersController);
// router.route("/numberReport").get(getNumberReportController);
// router.route("/sectorName").get(protect, getSectorNameController);
// router.route("/adminIsSeen").get(protect,verifySubcityLeader, getAllAdminBySeenController);
// router
//   .route("/removeIsSeen/:user_id")
//   .patch(protect, verifySubcityLeader, removeIsSeenController);
// router.route("/superPendingStatus").get(protect, getAllUsersWithPendingStatusController);
// router
//   .route("/adminPendingStatus")
//   .get(protect, getAllUsersWithPendingStatusAdminController);
// router
//   .route("/headPendingStatus")
//   .get(protect, getAllUsersWithPendingStatusHeadController);
// router
//   .route("/updateInfo")
//   .patch(protect, validateUserUpdate, updateUserController);
// router
//   .route("/updatePassword")
//   .patch(protect, validatePassword, updateUserPasswordController);
// router.post("/login", validateLoginInfo, authUserController);
// router
//   .route("/forgot-password")
//   .post(validateEmail, resetEmailPasswordController);
// router
//   .route("/reset-password")
//   .post(protect,validateResetPassword, resetPasswordController);
// router
//   .route("/resetPassword/:phoneNumber")
//   .patch(protect, verifySubcityLeader, resetUserPasswordController);
// router
//   .route("/userlist/:sectorName")
//   .get(protect, getPendingUsersBySector);


module.exports = router;
