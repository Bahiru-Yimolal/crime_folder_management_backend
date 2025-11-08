
const {
  createProfileService,
  getAllSectorProfileService,
  getOneUserProfileService,
  getAllUserProfileService,
  deleteOneProfileService,
  getOneUserUsingPhoneNumberProfileService,
  updateSingleFileService,
  updatePersonalInfoService,
} = require("../services/profileService");



const createProfileController = async (req, res, next) => {
  try {
    const bodyFields = [
      "firstName",
      "middleName",
      "lastName",
      "sex",
      "dateOfBirth",
      "emailAddress",
      "phoneNumber",
      "subcity",
      "workType",
      "subcitySector",
      "subcityCenter",
      "educationLevel",
      "educationType",
    ];

    const profileData = {};
    bodyFields.forEach((field) => {
      profileData[field] = req.body[field];
    });

    // ✅ Safely extract profilePhoto filename if it exists
    if (
      req.files &&
      req.files["profilePhoto"] &&
      req.files["profilePhoto"][0]
    ) {
      profileData.profilePhoto = req.files["profilePhoto"][0].filename;
    } else {
      profileData.profilePhoto = null; // or you can skip setting it if you prefer
    }

    console.log(profileData);

    const createdProfile = await createProfileService(profileData);

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      profile: createdProfile,
    });
  } catch (error) {
    next(error);
  }
};


const getOneProfileController = async (req, res, next) => {
  try {
    const user_profile_id = req.params.user_profile_id;

    // console.log(user_profile_id);

    const profile = await getOneUserProfileService(user_profile_id);

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "User profile not found" });
    }

    res.status(200).json({
      status: "success",
      data: profile,
    });
  } catch (error) {
    next(error); // Pass the error to middleware
  }
};

const getAllProfileController = async (req, res, next) => {
  try {


    const profile = await getAllUserProfileService();

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Users profile not found" });
    }

    res.status(200).json({
      status: "success",
      data: profile,
    });
  } catch (error) {
    next(error); // Pass the error to middleware
  }
};

const deleteOneProfileController = async (req, res, next) => {
  try {
    const { user_profile_id } = req.params;
    // console.log(user_profile_id);

    const response = await deleteOneProfileService(user_profile_id);

    res.status(200).json({
      status: "success",
      message: response.message,
    });
  } catch (error) {
    next(error); // Pass the error to middleware
  }
};


const getOneUsingPhoneNumberProfileController = async (req, res, next) => {
  try {
    const phone_Number = req.params.phone_Number;

    // console.log(user_profile_id);

    const profile = await getOneUserUsingPhoneNumberProfileService(
      phone_Number
    );

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "User profile not found" });
    }

    res.status(200).json({
      status: "success",
      data: profile,
    });
  } catch (error) {
    next(error); // Pass the error to middleware
  }
};

const getAllForSectorProfileController = async (req, res, next) => {
  try {
    const id = req.user.payload.categoryId;
    const role = req.user.payload.role;

    const profile = await getAllSectorProfileService(id, role);

    res.status(200).json({
      status: "success",
      data: profile,
    });
  } catch (error) {
    next(error); // Pass the error to middleware
  }
};

const updateSingleFileController = async (req, res, next) => {
  try {


    const { profile_id, delete_file_name } = req.body;

    const new_file_name = req.files["profilePhoto"][0].filename;

    // console.log(profile_id, column_name, delete_file_name, new_file_name);

    if (!profile_id || !new_file_name || !delete_file_name) {
      res.status(400).json({
        success: "False",
        message: "Please Enter all the Feilds",
      });
      return;
    }


    await updateSingleFileService(
      profile_id,
      new_file_name,
      delete_file_name
    );

    res.status(201).json({
      success: true,
      message: "File updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updatePersonalInfoController = async (req, res, next) => {
  try {


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
      profile_id,
    } = req.body;

    const updatedUser = await updatePersonalInfoService(
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
    );

    return res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
};




module.exports = {
  createProfileController,
  getOneProfileController,
  getAllProfileController,
  deleteOneProfileController,
  getOneUsingPhoneNumberProfileController,
  updateSingleFileController,
  updatePersonalInfoController,
  getAllForSectorProfileController,

};
