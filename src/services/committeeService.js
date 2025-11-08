const User = require("../models/userModel");
const Role = require("../models/roleModel");
const Committee = require("../models/committeeModel");
const Attendance = require("../models/attendanceModel");


const { AppError } = require("../middlewares/errorMiddleware");
const { Op } = require("sequelize");
const { hashPassword } = require("../utils/hashUtils");


const createCommitteeService = async (
    committee_name,
    committee_leader_id,
    subcity_id,
    school_address, 
    school_type, 
    school_location,
    sector_id
) => {

  const existingCommittee = await Committee.findOne({
    where: { committee_name, subcity_id },
  });

  if (existingCommittee) {
    throw new AppError("Committee with this name already exists", 400);
  }

  if (committee_leader_id) {
    const user = await User.findByPk(committee_leader_id);

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
  const committee = await Committee.create({
    committee_name,
    school_address, 
    school_type, 
    school_location,
    committee_leader_id,
    subcity_id,
    sector_id
  });

  if (committee_leader_id) {
    await Role.create({
      categories: "Committee",
      category_id: committee.committee_id,
      user_id: committee_leader_id,
    });
  }

  return committee;
};

const assignCommitteeService = async (committee_id, new_committee_leader_id) => {
  // Find the group by ID
  const committee = await Committee.findByPk(committee_id);
  if (!committee) {
    throw new AppError("Committee not found", 404);
  }

  // Find the new group leader by ID
  const newCommitteeLeader = await User.findByPk(new_committee_leader_id);
  if (!newCommitteeLeader) {
    throw new AppError("User not found", 404);
  }

  // Check if the new group leader is already assigned to another position
  if (newCommitteeLeader.status === "assigned") {
    throw new AppError("User is already assigned to another position", 400);
  }

  // Find the current group leader and update their status
  const currentCommitteeLeader = await User.findByPk(committee.committee_leader_id);
  if (currentCommitteeLeader) {
    currentCommitteeLeader.status = "pending"; // Set the previous group leader status back to 'pending'
    await currentCommitteeLeader.save();
  }

  // Update the group's leader
  committee.committee_leader_id = new_committee_leader_id;
  await committee.save();

  // Update the new group's leader status to 'assigned'
  newCommitteeLeader.status = "assigned";
  await newCommitteeLeader.save();

  await Role.create({
    categories: "Committee",
    category_id: committee.committee_id,
    user_id: new_committee_leader_id,
  });

  return committee;
};

const getAllCommitteesService = async ( sector_id) => {
  const committees = await Committee.findAll({
    where: { sector_id },
    include: [
      {
        model: User,
        as: "committee_Leader",
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

  return committees;
};

const getAllCommitteeLeadersService = async (subcity_id) => {
  const committees = await Committee.findAll({
    where: { subcity_id },
    include: [
      {
        model: User,
        as: "committee_Leader",
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

  return committees;
};

const updateCommitteeNameService = async (committee_id, newCommitteeName,       school_address, 
      school_type, 
      school_location ) => {
  // Find the group by its ID
  const committee = await Committee.findByPk(committee_id);

  if (!committee) {
    throw new AppError("Committee not found", 404);
  }

  const existingCommittee = await Committee.findOne({
    where: {
      committee_name: newCommitteeName,
      committee_id: { [Op.ne]: committee_id },
    },
  });

  if (existingCommittee) {
    throw new AppError("Committee with this name already exists", 400);
  }

  // Update the group name
  committee.committee_name = newCommitteeName || committee.committee_name;
  committee.school_address = school_address || committee.school_address;
  committee.school_type = school_type || committee.school_type;
  committee.school_location = school_location || committee.school_location;
  await committee.save(); // Save the updated group to the database

  return committee;
};

const unassignCommitteeService = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError("User not found", 404);

  // Update status to "pending"
  user.status = "pending";
  await user.save();

  return { message: "User status updated to pending" };
};

const resetCommitteeLeaderPasswordService = async (committee_leader_id) => {
  const committeeLeader = await User.findByPk(committee_leader_id);
  if (!committeeLeader) {
    throw new Error("Committee Leader not found");
  }

  const hashedPassword = await hashPassword(process.env.DEFAULT_PASSWORD);
  committeeLeader.password = hashedPassword;
  await committeeLeader.save();

  return committeeLeader;
};

// const createAttendanceService = async (data) => {
//   const {
//     user_id,
//     committee_id,
//     check_in_time,
//     check_out_time,
//     comments,
//     device_info,
//     location,
//   } = data;

//   // Ensure no duplicate check-in (optional logic)
//   // You can uncomment if needed:
//   // const existing = await Attendance.findOne({
//   //   where: { user_id, committee_id, check_out_time: null },
//   // });
//   // if (existing) {
//   //   throw new AppError("User already checked in and has not checked out yet.", 400);
//   // }

//   const attendance = await Attendance.create({
//     user_id,
//     committee_id,
//     check_in_time,
//     check_out_time,
//     comments,
//     device_info,
//     location,
//   });

//   return attendance;
// };


// Haversine formula for location distance (in meters)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const createAttendanceService = async (data) => {
  const {
    user_id,
    committee_id,
    check_in_time,
    check_out_time,
    comments,
    device_info,
    location, // expected: { latitude, longitude }
  } = data;

  if (!user_id || !committee_id) {
    throw new AppError("user_id and committee_id are required", 400);
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const existing = await Attendance.findOne({
    where: {
      user_id,
      committee_id,
      createdAt: { [Op.between]: [todayStart, todayEnd] },
    },
  });

  const committee = await Committee.findByPk(committee_id);
  if (!committee) throw new AppError("Committee not found", 404);

  // Parse committee location (assumed stored as "lat,lon")
  const { latitude: committeeLat, longitude: committeeLon } = committee.school_location;

  // CASE A — Check-in
  if (!existing && check_in_time) {
    if (location) {
      const { latitude, longitude } = location;
      const distance = calculateDistance(
        latitude,
        longitude,
        committeeLat,
        committeeLon
      );
      const THRESHOLD_METERS = 200; // Customize this threshold
      if (distance > THRESHOLD_METERS) {
        throw new AppError("Incorrect location — too far from School site", 400);
      }
    }

    const attendance = await Attendance.create({
      user_id,
      committee_id,
      check_in_time: check_in_time || new Date(),
      comments,
      device_info,
      location: JSON.stringify(location),
    });

    return attendance;
  }

  // CASE C — Check-out
  if (existing && check_out_time) {
    if (existing.check_out_time)
      throw new AppError("User already checked out for this School today", 400);

    if (
      new Date(check_out_time) < new Date(existing.check_in_time)
    ) {
      throw new AppError("Invalid check-out time", 400);
    }

    existing.check_out_time = check_out_time || new Date();
    existing.comments = comments || existing.comments;
    existing.device_info = device_info || existing.device_info;
    existing.location = location ? JSON.stringify(location) : existing.location;
    await existing.save();

    return existing;
  }

  // If user tries to check in again today
  if (existing && check_in_time && !check_out_time) {
    throw new AppError("User already checked in for this School today", 400);
  }

  // If no matching case
  throw new AppError("Invalid attendance request", 400);
};



module.exports = {
  createCommitteeService,
  assignCommitteeService,
  getAllCommitteesService,
  updateCommitteeNameService,
  unassignCommitteeService,
  getAllCommitteeLeadersService,
  resetCommitteeLeaderPasswordService,
  createAttendanceService
};
