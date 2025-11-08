const Sector = require("../models/sectorModel");
const WorkHistory = require("../models/workHistoryModel");
const Profile = require("../models/profileModel");
const { AppError } = require("../middlewares/errorMiddleware");
const { Op } = require("sequelize");
const fs = require("fs");
const paths = require("path");

const path = process.env.BASE_FILE_URL || "http://localhost:5000/uploads/";

const createProfileService = async (profileData) => {
  // console.log("Profile Data:", profileData);

  const {
    firstName,
    middleName,
    lastName,
    sex,
    dateOfBirth,
    emailAddress,
    phoneNumber,
    subcity,
    workType,
    subcitySector,
    subcityCenter,
    educationLevel,
    educationType,
    profilePhoto,
  } = profileData;

  const existingProfile = await Profile.findOne({
    where: { phoneNumber },
  });

  if (existingProfile) {
    throw new AppError("Profile with this phone number already exists", 400);
  }

  const existingProfiles = await Profile.findOne({
    where: { emailAddress },
  });

  if (existingProfiles) {
    throw new AppError("Profile with this email address already exists", 400);
  }



  const newProfile = await Profile.create({
    firstName,
    middleName,
    lastName,
    sex,
    dateOfBirth,
    emailAddress,
    phoneNumber,
    subcity,
    workType,
    subcitySector,
    subcityCenter,
    educationLevel,
    educationType,
    profilePhoto,
  });

  return newProfile;
};

const getOneUserProfileService = async (profileId) => {
  const profile = await Profile.findOne({
    where: { profile_id: profileId },
    include: [
      {
        model: WorkHistory,
        as: "WorkHistories", // This is Sequelize default pluralization
      },
    ],
    raw: false,
    nest: true,
  });

  if (!profile) {
    return null;
  }

  // Construct full URL path to profile photo
  if (profile.profilePhoto) {
    profile.profilePhoto = `${path}${profile.profilePhoto}`;
  }

  // Update certificate file paths in work history
  if (profile.WorkHistories && profile.WorkHistories.length > 0) {
    profile.WorkHistories = profile.WorkHistories.map((history) => {
      if (history.certificate) {
        history.certificate = `${path}${history.certificate}`;
      }
      return history;
    });
  }

  return profile;
};

const getAllUserProfileService = async () => {
   const profiles = await Profile.findAll({
    include: [
      {
        model: WorkHistory,
        as: "WorkHistories",
      },
    ],
    raw: false,
    nest: true,
  });

  if (!profiles || profiles.length === 0) {
    return null;
  }

  // Loop through each profile and update paths
  const updatedProfiles = profiles.map((profile) => {
    // Update profile photo path
    if (profile.profilePhoto) {
      profile.profilePhoto = `${path}${profile.profilePhoto}`;
    }

    // Update each work history certificate path
    if (profile.WorkHistories && profile.WorkHistories.length > 0) {
      profile.WorkHistories = profile.WorkHistories.map((history) => {
        if (history.certificate) {
          history.certificate = `${path}${history.certificate}`;
        }
        return history;
      });
    }

    return profile;
  });

  return updatedProfiles;
};


const getOneUserUsingPhoneNumberProfileService = async (phoneNumber) => {
  const profile = await Profile.findOne({
    where: { phoneNumber: phoneNumber },
    include: [
      {
        model: WorkHistory,
        as: "WorkHistories", // This is Sequelize default pluralization
      },
    ],
    raw: false,
    nest: true,
  });

  if (!profile) {
    return null;
  }

  // Construct full URL path to profile photo
  if (profile.profilePhoto) {
    profile.profilePhoto = `${path}${profile.profilePhoto}`;
  }

  // Update certificate file paths in work history
  if (profile.WorkHistories && profile.WorkHistories.length > 0) {
    profile.WorkHistories = profile.WorkHistories.map((history) => {
      if (history.certificate) {
        history.certificate = `${path}${history.certificate}`;
      }
      return history;
    });
  }

  return profile;
};

const getAllSectorProfileService = async (id,role) => {

  let updatedProfiles;

  if(role === "Sector Leader"){

    const sector = await Sector.findByPk(id);
  
    if (!sector) {
      throw new AppError("Sector not found", 404);
    }
  
    //  console.log(sector.sector_name);

   const profiles = await Profile.findAll({
    include: [
      {
        model: WorkHistory,
        where: { sector: sector.sector_name }, // filter work histories by sector
        required: true, // only include profiles that have work histories in this sector
      },
    ],
    raw: false,
    nest: true,
  });

  if (!profiles || profiles.length === 0) {
    return null;
  }

  // Loop through each profile and update paths
 updatedProfiles = profiles.map((profile) => {
    // Update profile photo path
    if (profile.profilePhoto) {
      profile.profilePhoto = `${path}${profile.profilePhoto}`;
    }

    // Update each work history certificate path
    if (profile.WorkHistories && profile.WorkHistories.length > 0) {
      profile.WorkHistories = profile.WorkHistories.map((history) => {
        if (history.certificate) {
          history.certificate = `${path}${history.certificate}`;
        }
        return history;
      });
    }

    return profile;
  });

  }else{

    const profiles = await Profile.findAll({
      include: [
        {
          model: WorkHistory,
          as: "WorkHistories",
        },
      ],
      raw: false,
      nest: true,
    });

    if (!profiles || profiles.length === 0) {
      return null;
    }

    // Loop through each profile and update paths
     updatedProfiles = profiles.map((profile) => {
      // Update profile photo path
      if (profile.profilePhoto) {
        profile.profilePhoto = `${path}${profile.profilePhoto}`;
      }

      // Update each work history certificate path
      if (profile.WorkHistories && profile.WorkHistories.length > 0) {
        profile.WorkHistories = profile.WorkHistories.map((history) => {
          if (history.certificate) {
            history.certificate = `${path}${history.certificate}`;
          }
          return history;
        });
      }

      return profile;
    });
  

  }

  return updatedProfiles;
};

const deleteOneProfileService = async (profileId) => {
  const profile = await Profile.findByPk(profileId);

  if (!profile) {
    throw new AppError("Profile not found", 404);
  }

  await profile.destroy();

  return { message: "Profile deleted successfully" };
};

const updateSingleFileService = async (
  profile_id,
  new_file_name,
  delete_file_name
) => {

  const profile = await Profile.findByPk(profile_id, { raw: false }); // Ensure raw: false

  if (!profile) {
    throw new AppError("Profile not found", 404);}
    
  if (delete_file_name) {
    const filePath = paths.join(__dirname, "../uploads", delete_file_name);
    fs.unlink(filePath, (err) => {
      if (err && err.code !== "ENOENT") {
        console.error("Error deleting file:", err);
        throw new AppError("Failed to delete the old file", 500);
      }
    });
  }


  // 3. Update the column in the database
  const [updated] = await Profile.update(
    { profilePhoto: new_file_name },
    { where: { profile_id: profile_id } }
  );

  if (!updated) {
    throw new AppError("Profile not found or file not updated", 404);
  }

  return true;
};


const updatePersonalInfoService = async (
  firstName,
  middleName,
  lastName,
  sex,
  dateOfBirth,
  emailAddress,
  phoneNumber,
  subcity,
  workType,
  subcitySector,
  subcityCenter,
  educationLevel,
  educationType,
  profile_id
) => {
  const profile = await Profile.findByPk(profile_id);

  if (!profile) {
    throw new AppError("Profile not found", 404);
  }

  // Check for duplicate phone number (excluding current profile)
  if (phoneNumber && phoneNumber !== profile.phoneNumber) {
    const existingProfile = await Profile.findOne({
      where: {
        phoneNumber,
        profile_id: { [Op.ne]: profile_id }, // exclude current profile
      },
    });

    if (existingProfile) {
      throw new AppError(
        "Phone number is already in use by another profile",
        400
      );
    }
  }

  if (emailAddress && emailAddress !== profile.emailAddress) {
    const existingProfiles = await Profile.findOne({
      where: {
        emailAddress,
        profile_id: { [Op.ne]: profile_id }, // exclude current profile
      },
    });

    if (existingProfiles) {
      throw new AppError(
        "Email Address is already in use by another profile",
        400
      );
    }
  }


  profile.firstName = firstName || profile.firstName;
  profile.middleName = middleName || profile.middleName;
  profile.lastName = lastName || profile.lastName;
  profile.sex = sex || profile.sex;
  profile.dateOfBirth = dateOfBirth || profile.dateOfBirth;
  profile.emailAddress = emailAddress || profile.emailAddress;
  profile.phoneNumber = phoneNumber || profile.phoneNumber;
  profile.subcity = subcity || profile.subcity;
  profile.workType = workType || profile.workType;
  profile.subcitySector = subcitySector || profile.subcitySector;
  profile.subcityCenter = subcityCenter || profile.subcityCenter;
  profile.educationLevel = educationLevel || profile.educationLevel;
  profile.educationType = educationType || profile.educationType;

  await profile.save();

  return profile;
};


module.exports = {
  createProfileService,
  getAllSectorProfileService,
  getOneUserProfileService,
  getAllUserProfileService,
  deleteOneProfileService,
  getOneUserUsingPhoneNumberProfileService,
  updateSingleFileService,
  updatePersonalInfoService,

};
