const {
  registerUserService,
  getAllUsersService,
  updateUserService,
  updatePasswordService,
  loginService,
  getAllUsersWithPendingService,
  registerAdminService,
  registerHeadService,
  registerWeService,
  registerSuperService,
  getAllUsersWithPendingAdminService,
  getAllUsersWithPendingHeadService,
  resetEmailPasswordService,
  resetPasswordService,
  getAllAdminBySeenService,
  removeIsSeenService,
  sendBulkEmailService,
  getSectorNameService,
  getNumberReportService,
  resetUserPasswordService,
} = require("../services/userService");

const authUserController = async (req, res, next) => {
  const { phone_number, password } = req.body;

  try {
    const result = await loginService(phone_number, password);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const userRegistrationController = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone_number, password, sector } = req.body;


    const newUser = await registerUserService(
      first_name,
      last_name,
      email,
      phone_number,
      password,
      sector
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    // Pass the error to the global error handler using next(error)
    next(error);
  }
};

const adminRegistrationController = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone_number, password } = req.body;

    const newUser = await registerAdminService(
      first_name,
      last_name,
      email,
      phone_number,
      password
    );

    res.status(201).json({
      success: true,
      message:
        "Admin created",
      user: newUser,
    });
  } catch (error) {
    // Pass the error to the global error handler using next(error)
    next(error);
  }
};

const headRegistrationController = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone_number,sector, password } = req.body;

    const newUser = await registerHeadService(
      first_name,
      last_name,
      email,
      phone_number,
      sector,
      password
    );

    res.status(201).json({
      success: true,
      message:
        "The administrator account has been successfully created. Access will be granted once it is authorized by the Super Administrator.",
      user: newUser,
    });
  } catch (error) {
    // Pass the error to the global error handler using next(error)
    next(error);
  }
};

const weRegistrationController = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone_number, password } = req.body;

    const newUser = await registerWeService(
      first_name,
      last_name,
      email,
      phone_number,
      password
    );

    res.status(201).json({
      success: true,
      message: "We created successfully",
      user: newUser,
    });
  } catch (error) {
    // Pass the error to the global error handler using next(error)
    next(error);
  }
};
const superRegistrationController = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone_number, password } = req.body;

    const newUser = await registerSuperService(
      first_name,
      last_name,
      email,
      phone_number,
      password
    );

    res.status(201).json({
      success: true,
      message: "Super created successfully",
      user: newUser,
    });
  } catch (error) {
    // Pass the error to the global error handler using next(error)
    next(error);
  }
};

const getAllUsersController = async (req, res, next) => {
  try {
    // Call the service to get all users

    const users = await getAllUsersService();

    // Respond with the list of users
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    // Pass any error to the error handling middleware
    next(error);
  }
};

const updateUserController = async (req, res, next) => {
  try {
    const { firstName, lastName,email, phoneNumber } = req.body;
    const userId = req.user.payload.userId; // Get user ID from the token

    const updatedUser = await updateUserService(
      userId,
      firstName,
      lastName,
      email,
      phoneNumber
    );

    return res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
};


const updateUserPasswordController = async (req, res, next) => {
  // const userId = req.user.id; // Assuming `req.user` has the authenticated user info
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.payload.userId;

  try {
    const result = await updatePasswordService(
      userId,
      currentPassword,
      newPassword
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getAllUsersWithPendingStatusController = async (req, res, next) => {
  try {
    // Call the service to get all users

    const users = await getAllUsersWithPendingService();

    // Respond with the list of users
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    // Pass any error to the error handling middleware
    next(error);
  }
};

const getAllUsersWithPendingStatusAdminController = async (req, res, next) => {
  try {
    // Call the service to get all users

    const users = await getAllUsersWithPendingAdminService();

    // Respond with the list of users
    res.status(200).json({
      success: true,
      message: "Admin retrieved successfully",
      users,
    });
  } catch (error) {
    // Pass any error to the error handling middleware
    next(error);
  }
};
const getAllUsersWithPendingStatusHeadController = async (req, res, next) => {
  try {
    // Call the service to get all users

    const users = await getAllUsersWithPendingHeadService();

    // Respond with the list of users
    res.status(200).json({
      success: true,
      message: "Head retrieved successfully",
      users,
    });
  } catch (error) {
    // Pass any error to the error handling middleware
    next(error);
  }
};

const resetEmailPasswordController = async (req, res, next) => {
  // const userId = req.user.id; // Assuming `req.user` has the authenticated user info
  const { email } = req.body;

  try {
    const result = await resetEmailPasswordService(email);
    res.status(200).json({ success: true, message: result });
  } catch (error) {
    next(error);
  }
};
const resetPasswordController = async (req, res, next) => {
  // const userId = req.user.id; // Assuming `req.user` has the authenticated user info
  const { password } = req.body;
  const userId = req.user.id;
  console.log(userId);

  try {
    const result = await resetPasswordService(userId, password);
    res.status(200).json({ success: true, message: result });
  } catch (error) {
    next(error);
  }
};

const getAllAdminBySeenController = async (req, res, next) => {
  try {
    // Call the service to get all users

    const users = await getAllAdminBySeenService();

    // Respond with the list of users
    res.status(200).json({
      success: true,
      message: "Admins retrieved successfully",
      users,
    });
  } catch (error) {
    // Pass any error to the error handling middleware
    next(error);
  }
};

const removeIsSeenController = async (req, res, next) => {
  try {
    const { user_id } = req.params;

    const updatedUser = await removeIsSeenService(user_id);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found or already marked as seen",
      });
    }

    res.status(200).json({
      success: true,
      message: "User isSeen status updated to true",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};


const sendBulkEmailController = async (req, res, next) => {
  try {
    const { subject, message, recipients } = req.body;

    // Call the service to send the emails
    const result = await sendBulkEmailService({ subject, message, recipients });

    res.status(200).json({
      success: true,
      message: `Email sent to ${recipients.length} recipient(s).`,
      result,
    });
  } catch (error) {
    next(error);
  }
};

const getSectorNameController = async (req, res, next) => {
  try {
    const id = req.user.payload.categoryId;
    const role = req.user.payload.role;

    const sectorName = await getSectorNameService(id, role);

    res.status(200).json({
      status: "success",
      data: sectorName,
    });
  } catch (error) {
    next(error); // Pass the error to middleware
  }
};


const getNumberReportController = async (req, res, next) => {
  try {
    const report = await getNumberReportService();

    res.status(200).json({
      status: "success",
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

const resetUserPasswordController = async (req, res, next) => {
  try {
    const { phoneNumber } = req.params;

    const result = await resetUserPasswordService(phoneNumber);

    res.status(200).json({
      success: true,
      message: `Password reset successfully to Password@123`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  userRegistrationController,
  getAllUsersController,
  updateUserController,
  updateUserPasswordController,
  authUserController,
  getAllUsersWithPendingStatusController,
  adminRegistrationController,
  headRegistrationController,
  weRegistrationController,
  getAllUsersWithPendingStatusAdminController,
  getAllUsersWithPendingStatusHeadController,
  superRegistrationController,
  resetEmailPasswordController,
  resetPasswordController,
  getAllAdminBySeenController,
  removeIsSeenController,
  sendBulkEmailController,
  getSectorNameController,
  getNumberReportController,
  resetUserPasswordController,
};
