const {
  createCommitteeService,
  assignCommitteeService,
  getAllCommitteesService,
  updateCommitteeNameService,
  unassignCommitteeService,
  getAllCommitteeLeadersService,
  resetCommitteeLeaderPasswordService,
  createAttendanceService
} = require("../services/committeeService");

const createCommitteeConroller = async (req, res, next) => {
  try {
    let { committee_name, committee_leader_id, school_address, school_type, school_location, sector_id } = req.body;

    const subcity_id = req.user.payload.categoryId;

    //  console.log(committee_leader_id);

    if (!subcity_id) {
      throw new AppError("Log in as a Sub city head", 400);
    }

    const newCommittee = await createCommitteeService(
      committee_name,
      committee_leader_id || null,
      subcity_id,
      school_address, 
      school_type, 
      school_location,
      sector_id
    );

    res.status(201).json({
      success: true,
      message: "Committee created successfully",
      group: newCommittee,
    });
  } catch (error) {
    next(error); // Pass the error to middleware
  }
};

const assignCommitteeController = async (req, res, next) => {
  try {
    const { committee_id, new_committee_leader_id } = req.body;

    // Call the service to reassign the group leader
    const updatedSector = await assignCommitteeService(
      committee_id,
      new_committee_leader_id
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

const getAllCommitteController = async (req, res, next) => {
  try {
    // const subcity_id = req.user.payload.categoryId;
    const { sector_id } = req.params;

    // if (!subcity_id) {
    //   throw new AppError("Log in as a Subcity leader", 400);
    // }

    if (!sector_id) {
      throw new AppError("sector_id parameter is required", 400);
    }

    const committees = await getAllCommitteesService(sector_id);
    return res.status(200).json({
      success: true,
      data: committees,
    });
  } catch (error) {
    next(error); // Pass the error to the error middleware
  }
};

const updateCommitteeNameController = async (req, res, next) => {
  try {
    const { committee_id } = req.params; // Get group_id from the request params
    const { committee_name,school_address, school_type, school_location } = req.body; // Get the new group name from the request body

    // console.log(committee_id, committee_name);

    const updatedCommittee = await updateCommitteeNameService(
      committee_id,
      committee_name,
      school_address, 
      school_type, 
      school_location 
    );

    return res.status(200).json({
      success: true,
      data: updatedCommittee,
    });
  } catch (error) {
    next(error); // Pass the error to the error middleware
  }
};

const unassignCommitteeController = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    // console.log(user_id);
    const result = await unassignCommitteeService(user_id);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const resetCommitteeLeaderPasswordController = async (req, res, next) => {
  try {
    const { committee_leader_id } = req.body;
    // console.log(user_id);
    const result = await resetCommitteeLeaderPasswordService(committee_leader_id);

    res.status(200).json({
      success: true,
      message: `Password reset successfully to Password@123 for user ID ${committee_leader_id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllCommitteeLeadersController = async (req, res, next) => {
  try {
    const subcity_id = req.user.payload.categoryId;

    if (!subcity_id) {
      throw new AppError("Log in as a Subcity leader", 400);
    }

    const committees = await getAllCommitteeLeadersService(subcity_id);
    return res.status(200).json({
      success: true,
      data: committees,
    });
  } catch (error) {
    next(error); // Pass the error to the error middleware
  }
};

const createAttendanceController = async (req, res, next) => {
  try {
    const attendance = await createAttendanceService(req.body);

    return res.status(201).json({
      success: true,
      message: "Attendance recorded successfully",
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createCommitteeConroller,
  assignCommitteeController,
  getAllCommitteController,
  updateCommitteeNameController,
  unassignCommitteeController,
  getAllCommitteeLeadersController,
  resetCommitteeLeaderPasswordController,
  createAttendanceController
};
