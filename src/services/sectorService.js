const User = require("../models/userModel");
const Role = require("../models/roleModel");
const Sector = require("../models/sectorModel");
const { AppError } = require("../middlewares/errorMiddleware");
const { Op } = require("sequelize");
const { hashPassword } = require("../utils/hashUtils");

const createSectorService = async (
  sector_name,
  sector_leader_id,
  subcity_id
) => {
  // console.log(sector_name,sector_leader_id,subcity_id);
  // Check if the user is already assigned
  const existingSector = await Sector.findOne({
    where: { sector_name, subcity_id },
  });

  if (existingSector) {
    throw new AppError("Sector with this name already exists", 400);
  }

  if (sector_leader_id) {
    const user = await User.findByPk(sector_leader_id);

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
  const sector = await Sector.create({
    sector_name,
    sector_leader_id,
    subcity_id,
  });

  if (sector_leader_id) {
    await Role.create({
      categories: "Sector Leader",
      category_id: sector.sector_id,
      user_id: sector_leader_id,
    });
  }

  return sector;
};

const assignSectorLeaderService = async (sector_id, new_sector_leader_id) => {
  // Find the group by ID
  const sector = await Sector.findByPk(sector_id);
  if (!sector) {
    throw new AppError("Sector not found", 404);
  }

  // Find the new group leader by ID
  const newSectorLeader = await User.findByPk(new_sector_leader_id);
  if (!newSectorLeader) {
    throw new AppError("User not found", 404);
  }

  // Check if the new group leader is already assigned to another position
  if (newSectorLeader.status === "assigned") {
    throw new AppError("User is already assigned to another position", 400);
  }

  // Find the current group leader and update their status
  const currentSectorLeader = await User.findByPk(
    sector.sector_leader_id
  );
  if (currentSectorLeader) {
    currentSectorLeader.status = "pending"; // Set the previous group leader status back to 'pending'
    await currentSectorLeader.save();
  }

  // Update the group's leader
  sector.sector_leader_id = new_sector_leader_id;
  await sector.save();

  // Update the new group's leader status to 'assigned'
  newSectorLeader.status = "assigned";
  await newSectorLeader.save();

  await Role.create({
    categories: "Sector Leader",
    category_id: sector.sector_id,
    user_id: new_sector_leader_id,
  });

  return sector;
};

const getAllSectorsService = async (subcity_id) => {
  const sectors = await Sector.findAll({
    where: { subcity_id },
    include: [
      {
        model: User,
        as: "sector_Leader",
        attributes: [
          "first_name",
          "last_name",
          "email",
          "phone_number",
          "status",
        ], // Only include these attributes
        required: false,
      },
    ],
  });

  return sectors;
};

const getAllSectorLeadersService = async (subcity_id) => {
  const sectors = await Sector.findAll({
    where: { subcity_id },
    include: [
      {
        model: User,
        as: "sector_Leader",
        attributes: [
          "first_name",
          "last_name",
          "email",
          "phone_number",
          "status",
        ], // Only include these attributes
        required: false,
      },
    ],
  });

  // const groupLeaders = groups.map((group) => group.group_Leader);

  return sectors;
};

const updateSectorNameService = async (sector_id, newSectorName) => {
  // Find the group by its ID
  const sector = await Sector.findByPk(sector_id);

  if (!sector) {
    throw new AppError("Sector not found", 404);
  }

  const existingSector = await Sector.findOne({
    where: { sector_name: newSectorName, sector_id: { [Op.ne]: sector_id } },
  });

  if (existingSector) {
    throw new AppError("Sector with this name already exists", 400);
  }

  // Update the group name
  sector.sector_name = newSectorName;
  await sector.save(); // Save the updated group to the database

  return sector;
};

const unassignSectorLeaderService = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError("User not found", 404);

  // Update status to "pending"
  user.status = "pending";
  await user.save();

  return { message: "User status updated to pending" };
};

const resetSectorLeaderPasswordService = async (sector_leader_id) => {
  const sectorLeader = await User.findByPk(sector_leader_id);
  if (!sectorLeader) {
    throw new Error("Sector Leader not found");
  }

  const hashedPassword = await hashPassword(process.env.DEFAULT_PASSWORD);
  sectorLeader.password = hashedPassword;
  await sectorLeader.save();

  return sectorLeader;
};

module.exports = {
  createSectorService,
  assignSectorLeaderService,
  getAllSectorsService,
  updateSectorNameService,
  unassignSectorLeaderService,
  resetSectorLeaderPasswordService,
  getAllSectorLeadersService,
};
