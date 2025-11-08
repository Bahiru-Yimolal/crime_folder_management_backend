const express = require("express");
const {
  createEventController,
  getEventSectorController,
  getEventsController,
  deleteOneEventController,
  updateEventController,
  deleteSingleFileController,
  generateEventReportController,
  getFormsByEventController,
  generateSectorEventReportController,
  addSingleFileController,
  createQRFormController,
  getEventController,
  getEventSectorNameController,
  generateSectorAdminEventReportController,
  generateEventSuperReportController,
} = require("../controllers/eventControllers");

const {

  validateEvent,
  validateUpdateEvent,
  validateQRFrom,
} = require("../validators/profileValidators");

const {
  protect,
} = require("../middlewares/authMiddleware");

const { upload } = require("../middlewares/uploadMiddleware");


const router = express.Router();



router
  .route("/qrform")
  .post(
    validateQRFrom,
    createQRFormController
  );

router
    .route("/sector/:sectorName")
    .get(protect, getEventSectorNameController);

router
  .route("/sector")
  .get(protect,getEventSectorController);



  
router.route("/:eventId").get(getEventController);

router.route("/qrform/:eventId").get(protect, getFormsByEventController);

 router
    .route("/")
    .post(
      protect,
      upload.fields([
        { name: "photos", maxCount: 10 },
        { name: "attendance", maxCount: 10 },
        { name: "attendantPhoto", maxCount: 10 },
      ]),      
      validateEvent,
      createEventController
    );

router
  .route("/eventReport/:startDate/:endDate")
  .get(protect, generateEventReportController);
  router
    .route("/eventSuperReport/:startDate/:endDate")
    .get(protect, generateEventSuperReportController);
  router
    .route("/sector/eventReport/:startDate/:endDate")
    .get(protect, generateSectorEventReportController);
  
    router
      .route("/sector/eventAdminReport/:startDate/:endDate")
      .get(protect, generateSectorAdminEventReportController);

router.route("/").get(getEventsController);
router
  .route("/add/singleFile/:event_id")
  .patch(
    protect,
    upload.any(), // Accept any file field
    addSingleFileController
  );


router
  .route("/delete/singleFile/:event_id")
  .patch(protect, deleteSingleFileController);

router
  .route("/:event_id")
  .delete(protect, deleteOneEventController);
router
  .route("/updateEvent/:event_id")
  .patch(
    protect,
    validateUpdateEvent,
    updateEventController
  );


module.exports = router;
