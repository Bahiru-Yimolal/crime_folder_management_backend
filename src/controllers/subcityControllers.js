const {
  createSubcitiesService,
  assignSubcityLeaderService,
  getAllSubcitiesService,
  updateSubcityService,
  unassignSubcityLeaderService,
  getAllSubcityLeadersService,
  resetSubcityLeaderPasswordService,
} = require("../services/subcityService");
const { AppError } = require("../middlewares/errorMiddleware");

const createSubcitiesController = async (req, res, next) => {
  try {

    const { subcity_name, subcity_leader_id } = req.body;

    // const sector_id = req.user.payload.categoryId; // group_id retrieved from decoded token
    // console.log(subcity_name, subcity_leader_id);

    if (!subcity_name) {
      throw new AppError("subcity name is required", 400);
    }

    const subcity = await createSubcitiesService(
      subcity_name,
      subcity_leader_id || null
      //   sector_id
    );

    res.status(201).json({
      success: true,
      message: "subcity created successfully",
      data: subcity,
    });
  } catch (error) {
    next(error);
  }
};

const assignSubcityLeaderController = async (req, res, next) => {
  try {
    const { subcity_id, new_subcity_leader_id } = req.body;

    if (!subcity_id || !new_subcity_leader_id) {
      throw new AppError(
        "subcity_id and new_sector_leader_id are required",
        400
      );
    }

    // Call the service to reassign the group leader
    const updatedSubcity = await assignSubcityLeaderService(
      subcity_id,
      new_subcity_leader_id
    );

    // Respond with success message and updated group
    res.status(200).json({
      success: true,
      message: "Subcity Leader assigned successfully",
      subciy: updatedSubcity,
    });
  } catch (error) {
    // Pass any error to the error handling middleware
    next(error);
  }
};

const getAllSubcitiesController = async (req, res, next) => {
  try {
    // console.log(req.user);
    // const sector_id = req.user.payload.categoryId;

    // if (!sector_id) {
    //   throw new AppError("Log in as a Sector leader", 400);
    // }

    const subcities = await getAllSubcitiesService();

    return res.status(200).json({
      success: true,
      data: subcities,
    });
    

  } catch (error) {
    next(error); // Pass the error to the error middleware
  }
};

const updateSubcityController = async (req, res, next) => {
  try {
    const { subcity_id } = req.params; // Get group_id from the request params
    const { subcity_name } = req.body; // Get the new group name from the request body

    if (!subcity_id || !subcity_name) {
      throw new AppError("subcity_id and subcity_name are required", 400);
    }

    const updatedSubcity = await updateSubcityService(
      subcity_id,
      subcity_name
    );

    return res.status(200).json({
      success: true,
      data: updatedSubcity,
    });
  } catch (error) {
    next(error); // Pass the error to the error middleware
  }
};

const unassignSubcityLeaderController = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    // console.log(user_id);
    const result = await unassignSubcityLeaderService(user_id);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllSubcityLeadersController = async (req, res, next) => {
  try {
    // console.log(req.user);
    // const sector_id = req.user.payload.categoryId;

    // if (!sector_id) {
    //   throw new AppError("Log in as a Group Leader", 400);
    // }

    const subciy = await getAllSubcityLeadersService();
    return res.status(200).json({
      success: true,
      data: subciy,
    });
  } catch (error) {
    next(error); // Pass the error to the error middleware
  }
};

const resetSubcityLeaderPasswordController = async (req, res, next) => {
  try {
    const { subcity_leader_id } = req.body;
    // console.log(user_id);
    const result = await resetSubcityLeaderPasswordService(
      subcity_leader_id
    );

    res.status(200).json({
      success: true,
      message: `Password reset successfully to Password@123 for user ID ${subcity_leader_id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSubcitiesController,
  assignSubcityLeaderController,
  getAllSubcitiesController,
  updateSubcityController,
  unassignSubcityLeaderController,
  getAllSubcityLeadersController,
  resetSubcityLeaderPasswordController,
};
