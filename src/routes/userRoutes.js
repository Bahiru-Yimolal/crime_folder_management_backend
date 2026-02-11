const express = require("express");
const {
  protect,
} = require("../middlewares/authMiddleware");
const {
  userRegistrationController,
  authUserController,
  getAllUsersController,
  updateUserController,
  updateUserPasswordController,
  resetEmailPasswordController,
  resetPasswordController,
  resetUserPasswordController,
  getAllUsersWithPendingStatusController
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
router
  .route("/updateInfo")
  .patch(protect, validateUserUpdate, updateUserController);
router
  .route("/updatePassword")
  .patch(protect, validatePassword, updateUserPasswordController);
router.route("/").get(protect, getAllUsersController);
router
  .route("/forgot-password")
  .post(validateEmail, resetEmailPasswordController);
router
  .route("/reset-password")
  .post(protect,validateResetPassword, resetPasswordController);
router
  .route("/resetPassword/:phoneNumber")
  .patch(protect, resetUserPasswordController);
router.route("/pendingStatus").get(protect, getAllUsersWithPendingStatusController);

// router.route("/sendBulkEmail").post(protect,validateEmailAttributes, sendBulkEmailController);





module.exports = router;
