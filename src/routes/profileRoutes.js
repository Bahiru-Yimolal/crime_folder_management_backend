const express = require("express");
const {
  createProfileController,
  getOneProfileController,
  getAllProfileController,
  deleteOneProfileController,
  getOneUsingPhoneNumberProfileController,
  updateSingleFileController,
  updatePersonalInfoController,
  getAllForSectorProfileController,
} = require("../controllers/profileControllers");

const {
  validateProfile,
  validatePersonalInfo,
} = require("../validators/profileValidators");

const {
  protect,
} = require("../middlewares/authMiddleware");

const { upload } = require("../middlewares/uploadMiddleware");

// Upload multiple named fields
const uploadFields = upload.fields([
  { name: "profilePhotoFile", maxCount: 1 },
  { name: "kebeleIdFile", maxCount: 1 },
  { name: "nationalIdFile", maxCount: 1 },
  { name: "educationDegreeFile", maxCount: 1 },
  { name: "educationMastersFile", maxCount: 1 },
  { name: "educationPHDFile", maxCount: 1 },
  { name: "otherFiles", maxCount: 10 },
]);

const router = express.Router();

router
  .route("/")
  .post(
    protect,
    upload.fields([{ name: "profilePhoto", maxCount: 1 }]),
    validateProfile,
    createProfileController
  );
router
  .route("/:user_profile_id")
  .get(protect, getOneProfileController);
router
  .route("/User/:phone_Number")
  .get(protect, getOneUsingPhoneNumberProfileController);
router
    .route("/admin/sector")
    .get(protect, getAllForSectorProfileController);
router.route("/").get(protect, getAllProfileController);
router
  .route("/update/singleFile")
  .patch(
    protect,
    upload.fields([{ name: "profilePhoto", maxCount: 1 }]),
    updateSingleFileController
  );

router
  .route("/:user_profile_id")
  .delete(protect, deleteOneProfileController);
router
  .route("/updatePersonalInfo")
  .patch(
    protect,
    validatePersonalInfo,
    updatePersonalInfoController
  );




module.exports = router;
