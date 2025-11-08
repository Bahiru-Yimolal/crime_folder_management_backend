const {
  createPlanService,
  getPlanService,
  updatePlanService,
  getUnseenPlanService,
  rejectPlanService,
  acceptPlanService,
} = require("../services/planService");



const createPlanController = async (req, res, next) => {
  try {


    const id = req.user.payload.categoryId;
    const role = req.user.payload.role;

    const { plan } = req.body;

    if (!plan) {
      throw new AppError("Plan is required", 400);
    }

    const createdEvent = await createPlanService(plan, role, id);

    res.status(201).json({
      success: true,
      message: "Plan created successfully",
      event: createdEvent,
    });
  } catch (error) {
    next(error);
  }
};

const getPlanController = async (req, res, next) => {
  try {
    const id = req.user.payload.categoryId;
    const role = req.user.payload.role;

    const plan = await getPlanService(role, id);

    res.status(201).json({
      success: true,
      plan: plan,
    });
  } catch (error) {
    next(error);
  }
};

const updatePlanController = async (req, res, next) => {
  try {
    const {  plan_to_update } = req.body;
    const role = req.user.payload.role;
    const id = req.user.payload.categoryId;

    if (!plan_to_update) {
      throw new AppError("Plan to update is required", 400);
    }

    const updated = await updatePlanService({ plan_to_update, role, id });

    res.status(200).json({
      success: true,
      message: "Update for plan sent successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};


const getUnseenPlanController = async (req, res, next) => {
  try {
    const unseenPlans = await getUnseenPlanService();

    res.status(200).json({
      success: true,
      message: "Unseen plans fetched successfully",
      data: unseenPlans,
    });
  } catch (error) {
    next(error);
  }
};

const rejectPlanController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedPlan = await rejectPlanService(id);

    res.status(200).json({
      success: true,
      message: "Plan rejected successfully",
      data: updatedPlan,
    });
  } catch (error) {
    next(error);
  }
};

const acceptPlanController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedPlan = await acceptPlanService(id);

    res.status(200).json({
      success: true,
      message: "Plan accepted and updated successfully",
      data: updatedPlan,
    });
  } catch (error) {
    next(error);
  }
};



module.exports = {
  createPlanController,
  getPlanController,
  updatePlanController,
  getUnseenPlanController,
  rejectPlanController,
  acceptPlanController,
};


