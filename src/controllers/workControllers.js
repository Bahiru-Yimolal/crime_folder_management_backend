const {
  createWorkService,
  getWorkHistoryService,
  deleteWorkHistoryService,
  updateWorkHistoryService,
  getSectorWorkHistoryService,
  getAllWorkHistoryService,
  generateTrainingReportService,
  generateSectorTrainingReportService,
} = require("../services/workService");



const createWorkController = async (req, res, next) => {
  try {
    const bodyFields = [
      "organization",
      "courseType",
      "sector",
      "certificateLink",
      "profile_id",
      "date",
      "isComplete",
    ];

    const workData = {};
    bodyFields.forEach((field) => {
      workData[field] = req.body[field];
    });

    // Handle uploaded file
    workData.certificate =
      (req.files &&
        req.files["certificate"] &&
        req.files["certificate"][0] &&
        req.files["certificate"][0].filename) ||
      undefined;

    // console.log(workData);


    const createdWork = await createWorkService(workData);

    res.status(201).json({
      success: true,
      message: "Certificate Added successfully",
      work: createdWork,
    });
  } catch (error) {
    next(error);
  }
};


const getSectorWorkHistoryController = async (req, res, next) => {
  try {
   
    const sector_id = req.user.payload.categoryId;

    if (!sector_id) {
      throw new AppError("Log in as a Sector leader", 400);
    }

    const workHistories = await getSectorWorkHistoryService(sector_id);

    if (!workHistories) {
      return res.status(404).json({
        success: false,
        message: "No certificate found for this Sector",
      });
    }

    res.status(200).json({
      success: true,
      data: workHistories,
    });
  } catch (error) {
    next(error);
  }
};

const getWorkHistoryController = async (req, res, next) => {
  try {
    const profileId = req.params.profile_id;

    const workHistories = await getWorkHistoryService(profileId);

    if (!workHistories) {
      return res.status(404).json({
        success: false,
        message: "No certificate found for this profile",
      });
    }

    res.status(200).json({
      success: true,
      data: workHistories,
    });
  } catch (error) {
    next(error);
  }
};
const getAllWorkHistoryController = async (req, res, next) => {
  try {

    const workHistories = await getAllWorkHistoryService();

    if (!workHistories) {
      return res.status(404).json({
        success: false,
        message: "No certificate found",
      });
    }

    res.status(200).json({
      success: true,
      data: workHistories,
    });
  } catch (error) {
    next(error);
  }
};

const deleteWorkHistoryController = async (req, res, next) => {
  try {
    const { work_history_id } = req.params;

    const deleted = await deleteWorkHistoryService(work_history_id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Certificate deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
  

const updateWorkHistoryController = async (req, res, next) => {
  try {
    const { work_history_id } = req.params;
    const updateFields = [
      "organization",
      "courseType",
      "sector",
      "date",
      "isComplete",
      "certificateLink",
    ];

    const updateData = {};
    updateFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Handle uploaded file if provided
    updateData.certificate =
      (req.files &&
        req.files["certificate"] &&
        req.files["certificate"][0] &&
        req.files["certificate"][0].filename) ||
      undefined;

    const updatedWork = await updateWorkHistoryService(
      work_history_id,
      updateData
    );

    if (!updatedWork) {
      return res
        .status(404)
        .json({ success: false, message: "Certificate not found" });
    }

    res.status(200).json({
      success: true,
      message: "Certificate Info updated successfully",
      work: updatedWork,
    });
  } catch (error) {
    next(error);
  }
};

const generateTrainingReportController = async (req, res, next) => {
  try {
    const { isComplete,startDate, endDate } = req.params;

    // console.log(isComplete);

    const report = await generateTrainingReportService({
      isComplete,
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

const generateSectorTrainingReportController = async (req, res, next) => {
  try {
    const { isComplete, startDate, endDate } = req.params;

    const id = req.user.payload.categoryId;
    const role = req.user.payload.role;

    const report = await generateSectorTrainingReportService({
      isComplete,
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
  createWorkController,
  getWorkHistoryController,
  deleteWorkHistoryController,
  updateWorkHistoryController,
  getSectorWorkHistoryController,
  getAllWorkHistoryController,
  generateTrainingReportController,
  generateSectorTrainingReportController,
};
