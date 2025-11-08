const {
  createSectorService,
  assignSectorLeaderService,
  getAllSectorsService,
  updateSectorNameService,
  unassignSectorLeaderService,
  resetSectorLeaderPasswordService,
  getAllSectorLeadersService,
} = require("../services/sectorService");

const createSectorConroller = async (req, res, next) => {
  try {
    let { sector_name, sector_leader_id } = req.body;

    const subcity_id = req.user.payload.categoryId;

    //  console.log(division_id);

    if (!subcity_id) {
      throw new AppError("Log in as a Sub city head", 400);
    }

    const newSector = await createSectorService(
      sector_name,
      sector_leader_id || null,
      subcity_id
    );

    res.status(201).json({
      success: true,
      message: "Sector created successfully",
      group: newSector,
    });
  } catch (error) {
    next(error); // Pass the error to middleware
  }
};

const assignSectorLeaderController = async (req, res, next) => {
  try {
    const { sector_id, new_sector_leader_id } = req.body;

    // Call the service to reassign the group leader
    const updatedSector = await assignSectorLeaderService(
      sector_id,
      new_sector_leader_id
    );

    // Respond with success message and updated group
    res.status(200).json({
      success: true,
      message: "Sector leader assigned successfully",
      group: updatedSector,
    });
  } catch (error) {
    // Pass any error to the error handling middleware
    next(error);
  }
};

const getAllSectorsController = async (req, res, next) => {
  try {
    const subcity_id = req.user.payload.categoryId;

    if (!subcity_id) {
      throw new AppError("Log in as a Subcity leader", 400);
    }

    const sectors = await getAllSectorsService(subcity_id);
    return res.status(200).json({
      success: true,
      data: sectors,
    });
  } catch (error) {
    next(error); // Pass the error to the error middleware
  }
};

const updateSectorNameController = async (req, res, next) => {
  try {
    const { sector_id } = req.params; // Get group_id from the request params
    const { sector_name } = req.body; // Get the new group name from the request body

    if (!sector_id || !sector_name) {
      throw new AppError("sector_id and sector_name are required", 400);
    }

    const updatedSector = await updateSectorNameService(sector_id, sector_name);

    return res.status(200).json({
      success: true,
      data: updatedSector,
    });
  } catch (error) {
    next(error); // Pass the error to the error middleware
  }
};

const unassignSectorLeaderController = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    // console.log(user_id);
    const result = await unassignSectorLeaderService(user_id);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const resetSectorLeaderPasswordController = async (req, res, next) => {
  try {
    const { sector_leader_id } = req.body;
    // console.log(user_id);
    const result = await resetSectorLeaderPasswordService(sector_leader_id);

    res.status(200).json({
      success: true,
      message: `Password reset successfully to Password@123 for user ID ${sector_leader_id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllSectorLeadersController = async (req, res, next) => {
  try {
    const subcity_id = req.user.payload.categoryId;

    if (!subcity_id) {
      throw new AppError("Log in as a Subcity leader", 400);
    }

    const sectors = await getAllSectorLeadersService(subcity_id);
    return res.status(200).json({
      success: true,
      data: sectors,
    });
  } catch (error) {
    next(error); // Pass the error to the error middleware
  }
};

module.exports = {
  createSectorConroller,
    assignSectorLeaderController,
  getAllSectorsController,
  updateSectorNameController,
  unassignSectorLeaderController,
  resetSectorLeaderPasswordController,
  getAllSectorLeadersController,
};
