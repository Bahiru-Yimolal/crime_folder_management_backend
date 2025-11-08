const Sector = require("../models/sectorModel");
const Plan = require("../models/planModel");
const { AppError } = require("../middlewares/errorMiddleware");
const Subcity = require("../models/subcityModel");



const createPlanService = async (plan, role, id) => {
  let sector;

  if (role === "Sub-City Head") {
    const sectorValue = await Subcity.findByPk(id);
    if (!sectorValue) {
      throw new AppError("Subcity not found", 404);
    }
    sector = sectorValue.subcity_name;
  } else {
    const sectorValue = await Sector.findByPk(id);
    if (!sectorValue) {
      throw new AppError("Sector not found", 404);
    }
    sector = sectorValue.sector_name;
  }

  // Check if a plan already exists for this sector
  const existingPlan = await Plan.findOne({ where: { sector } });

  if (existingPlan) {
    throw new AppError(`A plan for sector "${sector}" already exists`, 400);
  }

  // Create new plan
  const newPlan = await Plan.create({
    sector,
    plan,
    status:"none",
  });

  return newPlan;
};

const getPlanService = async (role, id) => {
  let sector;

  if (role === "Sub-City Head") {
    const subcity = await Subcity.findByPk(id);
    if (!subcity) {
      throw new AppError("Subcity not found", 404);
    }
    sector = subcity.subcity_name;
  } else {
    const sectorRecord = await Sector.findByPk(id);
    if (!sectorRecord) {
      throw new AppError("Sector not found", 404);
    }
    sector = sectorRecord.sector_name;
  }

  const plan = await Plan.findOne({
    where: { sector },
    order: [["created_at", "DESC"]], // Optional: gets the most recent if multiple exist
  });

  if (!plan) {
    throw new AppError(`No plan found for sector "${sector}"`, 404);
  }

  return plan;
};

const updatePlanService = async ({ plan_to_update, role, id }) => {
  let sector;

  // 1. Identify the sector name
  if (role === "Sub-City Head") {
    const subcity = await Subcity.findByPk(id);
    if (!subcity) throw new AppError("Subcity not found", 404);
    sector = subcity.subcity_name;
  } else {
    const sectorRecord = await Sector.findByPk(id);
    if (!sectorRecord) throw new AppError("Sector not found", 404);
    sector = sectorRecord.sector_name;
  }

  // 2. Find existing plan
  const existingPlan = await Plan.findOne({ where: { sector } });

  if (!existingPlan) {
    throw new AppError(`No plan found for sector "${sector}" to update`, 404);
  }

  // 4. Check that new plan is not less than current
  // if (plan <= existingPlan.plan) {
  //   throw new AppError(
  //     `New plan (${plan}) cannot be less than or equal to the current plan (${existingPlan.plan})`,
  //     400
  //   );
  // }

  // 5. Update plan and reset isDisable to false

  existingPlan.plan_to_update = plan_to_update;
  existingPlan.status = "pending";
  existingPlan.isSeen = "false";

  await existingPlan.save();

  return existingPlan;
};

const getUnseenPlanService = async () => {
  const unseenPlans = await Plan.findAll({
    where: {
      isSeen: false,
    },
    order: [["created_at", "DESC"]], // optional: show latest first
  });

  return unseenPlans;
};

const rejectPlanService = async (id) => {
  const plan = await Plan.findByPk(id);

  if (!plan) {
    throw new AppError("Plan not found", 404);
  }

  // Update the plan
  plan.isSeen = true;
  plan.status = "rejected";

  await plan.save();

  return plan;
};

const acceptPlanService = async (id) => {
  const plan = await Plan.findByPk(id);

  if (!plan) {
    throw new AppError("Plan not found", 404);
  }

  if (plan.plan_to_update == null) {
    throw new AppError("No pending update to accept", 400);
  }

  // Apply the update
  plan.plan = plan.plan_to_update;
  plan.plan_to_update = null;
  plan.isSeen = true;
  plan.status = "accepted";

  await plan.save();

  return plan;
};


module.exports = {
  createPlanService,
  getPlanService,
  updatePlanService,
  getUnseenPlanService,
  rejectPlanService,
  acceptPlanService,
};
