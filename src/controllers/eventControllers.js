const {
  createEventService,
  getEventSectorService,
  getEventsService,
  deleteOneEventService,
  updateEventService,
  generateEventReportService,
  getFormsByEventService,
  createQRFormService,
  generateSecotrEventReportService,
  addSingleFileService,
  deleteSingleFileService,
  getEventService,
  getEventSectorNameService,
  generateSecotrAdminEventReportService,
  generateEventSuperReportService,
} = require("../services/eventService");



const createEventController = async (req, res, next) => {
  try {
    const bodyFields = [
      "title",
      "subTitle",
      "description",
      "placeOfEvent",
      "state",
      "noOfParticipant",
      "realParticipant",
      "date",
      "visiblity"
    ];

    const id = req.user.payload.categoryId;
    const role = req.user.payload.role;

    const profileData = {};

    bodyFields.forEach((field) => {
      profileData[field] = req.body[field];
    });


    // Handle uploaded files
    const photos = req.files?.photos || [];
    const attendance = req.files?.attendance || [];
    const attendantPhoto = req.files?.attendantPhoto || [];

    profileData.photos = photos.map((f) => f.filename);
    profileData.attendance = attendance.map((f) => f.filename);
    profileData.attendantPhoto = attendantPhoto.map((f) => f.filename);


    const createdEvent = await createEventService(profileData,role,id);

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event: createdEvent,
    });
  } catch (error) {
    next(error);
  }
};

const updateEventController = async (req, res, next) => {
  try {
    const bodyFields = [
      "title",
      "subTitle",
      "description",
      "placeOfEvent",
      "state",
      "noOfParticipant",
      "realParticipant",
      "date",
      "visiblity",
    ];

    const { event_id } = req.params;

    const profileData = {};

    bodyFields.forEach((field) => {
      profileData[field] = req.body[field];
    });

    // Handle uploaded single files

    const createdEvent = await updateEventService(profileData, event_id);

    res.status(201).json({
      success: true,
      message: "Event Updated successfully",
      event: createdEvent,
    });
  } catch (error) {
    next(error);
  }
};


const getEventSectorController = async (req, res, next) => {
  try {
    // const sector = req.params.sector;

    const id = req.user.payload.categoryId;
    const role = req.user.payload.role;

    const events = await getEventSectorService(id,role);

    if (!events) {
      return resgenerateSectorEventReportController
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    res.status(200).json({
      status: "success",
      data: events,
    });
  } catch (error) {
    next(error); // Pass the error to middleware
  }
};

const getEventSectorNameController = async (req, res, next) => {
  try {


    
    const {sectorName} = req.params;

    const events = await getEventSectorNameService(sectorName);

    if (!events) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    res.status(200).json({
      status: "success",
      data: events,
    });
  } catch (error) {
    next(error); // Pass the error to middleware
  }
};

const getEventsController = async (req, res, next) => {
  try {

    const events = await getEventsService();

    if (!events) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    res.status(200).json({
      status: "success",
      data: events,
    });
  } catch (error) {
    next(error); // Pass the error to middleware
  }
};

const deleteOneEventController = async (req, res, next) => {
  try {
    const { event_id } = req.params;

    const response = await deleteOneEventService(event_id);

    res.status(200).json({
      status: "success",
      message: response.message,
    });
  } catch (error) {
    next(error); // Pass the error to middleware
  }
};


const addSingleFileController = async (req, res, next) => {
  try {
    const { event_id } = req.params;
    const { column_name } = req.body;

    const allowedColumns = ["photos", "attendance", "attendantPhoto"];

    if (!event_id || !column_name || !allowedColumns.includes(column_name)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid event ID and column_name (photos, attendance, or attendantPhoto)",
      });
    }

    const uploadedFiles = req.files.filter(file => file.fieldname === column_name);

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: `No files uploaded under the field "${column_name}"`,
      });
    }

    const newFileNames = uploadedFiles.map((file) => file.filename);

    await addSingleFileService(event_id, column_name, newFileNames);

    res.status(201).json({
      success: true,
      message: "Files added successfully",
    });
  } catch (error) {
    next(error);
  }
};


const deleteSingleFileController = async (req, res, next) => {
  try {
    const { event_id } = req.params;
    const { delete_file_name, column_name } = req.body;

    const allowedColumns = ["photos", "attendance", "attendantPhoto"];

    if (!event_id || !delete_file_name || !column_name) {
      return res.status(400).json({
        success: false,
        message: "Please provide event_id, delete_file_name, and column_name.",
      });
    }

    if (!allowedColumns.includes(column_name)) {
      return res.status(400).json({
        success: false,
        message: "Invalid column name.",
      });
    }

    await deleteSingleFileService(event_id, delete_file_name, column_name);

    res.status(200).json({
      success: true,
      message: "File deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};


const generateEventReportController = async (req, res, next) => {
  try {
    // const { leadershipSubRole, startDate, endDate } = req.body;
    const { startDate, endDate } = req.params;


    const report = await generateEventReportService({
      startDate,
      endDate,
    });

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

const generateEventSuperReportController = async (req, res, next) => {
  try {
    // const { leadershipSubRole, startDate, endDate } = req.body;
    const { startDate, endDate } = req.params;

    const report = await generateEventSuperReportService({
      startDate,
      endDate,
    });

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

const createQRFormController = async (req, res, next) => {
  try {
    const bodyFields = [
      "fullName",
      "sector",
      "rate",
      "gender",
      "deviceAddress",
      "deviceLocation",
      "event_id",
    ];

    const formData = {};

    bodyFields.forEach((field) => {
      formData[field] = req.body[field];
    });

    const createdQRForm = await createQRFormService(formData);

    res.status(201).json({
      success: true,
      message: "QR Form submitted successfully",
      data: createdQRForm,
    });
  } catch (error) {
    next(error);
  }
};


const getFormsByEventController = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const forms = await getFormsByEventService(eventId);

    res.status(200).json({
      success: true,
      message: "Forms retrieved successfully",
      data: forms,
    });
  } catch (error) {
    next(error);
  }
};

const generateSectorEventReportController = async (req, res, next) => {
  try {
    // const { leadershipSubRole, startDate, endDate } = req.body;
    const { startDate, endDate } = req.params;

    const id = req.user.payload.categoryId;
    const role = req.user.payload.role;

    const report = await generateSecotrEventReportService({
      startDate,
      endDate,
      id,
      role,
    });

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

const getEventController = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const event = await getEventService(eventId);

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    res.status(200).json({
      status: "success",
      data: event,
    });
  } catch (error) {
    next(error); // Pass the error to middleware
  }
};

const generateSectorAdminEventReportController = async (req, res, next) => {
  try {

    const { startDate, endDate } = req.params;

    const id = req.user.payload.categoryId;
    const role = req.user.payload.role;

    const report = await generateSecotrAdminEventReportService({
      startDate,
      endDate,
      id,
      role,
    });

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addSingleFileController,
  deleteSingleFileController,
  generateEventReportController,
  getFormsByEventController,
  generateSectorEventReportController,
  getEventSectorController,
  createEventController,
  getEventsController,
  deleteOneEventController,
  updateEventController,
  createQRFormController,
  getEventController,
  getEventSectorNameController,
  generateSectorAdminEventReportController,
  generateEventSuperReportController,
};
