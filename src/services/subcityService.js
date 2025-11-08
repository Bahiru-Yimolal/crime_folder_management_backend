const User = require("../models/userModel");
const Role = require("../models/roleModel");
const Subcity = require("../models/subcityModel");
const { AppError } = require("../middlewares/errorMiddleware");
const { Op } = require("sequelize");
const { hashPassword } = require("../utils/hashUtils");

const createSubcitiesService = async (
  subcity_name,
  subcity_leader_id
  //   sector_id
) => {
  // console.log(profession_name, professional_id, group_id);
  // Check if the user is already assigned
  const existingSubcity = await Subcity.findOne({
    where: { subcity_name },
  });

  if (existingSubcity) {
    throw new AppError("Subcity with this name already exists", 400);
  }

  if (subcity_leader_id) {
    const user = await User.findByPk(subcity_leader_id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.status === "assigned") {
      throw new AppError("User is already assigned to another position", 400);
    }

    // Update the user status to "assigned" if a valid group leader is provided
    user.status = "assigned";
    await user.save();
  }

  // Create the group (leader_id can be null)
  const subcity = await Subcity.create({
    subcity_name,
    subcity_leader_id,
    // sector_id,
  });

  if (subcity_leader_id) {
    await Role.create({
      categories: "Sub-City Head",
      category_id: subcity.subcity_id,
      user_id: subcity_leader_id,
    });
  }

  return subcity;
};

const assignSubcityLeaderService = async (
  subcity_id,
  new_subcity_leader_id
) => {
  // Find the group by ID
  const subcity = await Subcity.findByPk(subcity_id);
  if (!subcity) {
    throw new AppError("Subcity not found", 404);
  }

  // Find the new group leader by ID
  const newSubcityLeader = await User.findByPk(new_subcity_leader_id);
  if (!newSubcityLeader) {
    throw new AppError("User not found", 404);
  }

  // Check if the new group leader is already assigned to another position
  if (newSubcityLeader.status === "assigned") {
    throw new AppError("User is already assigned to another position", 400);
  }

  // console.log(subcity.subcity_leader_id);

  const currentSubcityLeader = await User.findByPk(
    subcity.subcity_leader_id
  );

  // console.log(currentSubcityLeader.status);

  if (currentSubcityLeader) {
    currentSubcityLeader.status = "pending"; // Set the previous group leader status back to 'pending'
    await currentSubcityLeader.save();
  }

  // Update the group's leader
  subcity.subcity_leader_id = new_subcity_leader_id;
  //   console.log(subcity.dataValues);
  await subcity.save();

  // Update the new group's leader status to 'assigned'
  newSubcityLeader.status = "assigned";
  await newSubcityLeader.save();

  await Role.create({
    categories: "Sub-City Head",
    category_id: subcity.subcity_id,
    user_id: new_subcity_leader_id,
  });

  return subcity;
};

const getAllSubcitiesService = async () => {
  const subcities = await Subcity.findAll({
    // where: { sector_id },
    include: [
      {
        model: User,
        as: "subcity_Leader",
        attributes: [
          "user_id",
          "first_name",
          "last_name",
          "phone_number",
          "status",
        ],
      },
    ],
  });

  return subcities;
};

const updateSubcityService = async (subcity_id, newSubcityName) => {
  // Find the group by its ID
  const subcity = await Subcity.findByPk(subcity_id);

  if (!subcity) {
    throw new AppError("Subcity not found", 404);
  }

  const existingSubcity = await Subcity.findOne({
    where: {
      subcity_name: newSubcityName,
      subcity_id: { [Op.ne]: subcity_id },
    },
  });

  if (existingSubcity) {
    throw new AppError("Subcity with this name already exists", 400);
  }

  // Update the group name
  subcity.subcity_name = newSubcityName;
  await subcity.save(); // Save the updated group to the database

  return subcity;
};

const unassignSubcityLeaderService = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError("User not found", 404);

  // Update status to "pending"
  user.status = "pending";
  await user.save();

  return { message: "User status updated to pending" };
};

const getAllSubcityLeadersService = async () => {
  const subcities = await Subcity.findAll({
    // where: { sector_id },
    include: [
      {
        model: User,
        as: "subcity_Leader",
        attributes: [
          "user_id",
          "first_name",
          "last_name",
          "phone_number",
          "status",
        ],
      },
    ],
    // attributes: [], // Exclude Profession fields from the response
  });

  // Step 2: Map over the results to return only the professional's details
  //   const coordinators = divisions.map((division) => division.coordinator);

  return subcities;
};

const resetSubcityLeaderPasswordService = async (subcity_leader_id) => {
  const subcity_Leader = await User.findByPk(subcity_leader_id);
  if (!subcity_Leader) {
    throw new Error("Subcity Leader not found");
  }

  const hashedPassword = await hashPassword(process.env.DEFAULT_PASSWORD);
  subcity_Leader.password = hashedPassword;
  await subcity_Leader.save();

  return subcity_Leader;
};

module.exports = {
  createSubcitiesService,
  assignSubcityLeaderService,
  getAllSubcitiesService,
  updateSubcityService,
  unassignSubcityLeaderService,
  getAllSubcityLeadersService,
  resetSubcityLeaderPasswordService,
};
