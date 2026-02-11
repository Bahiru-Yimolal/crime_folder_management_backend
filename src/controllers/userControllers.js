const {
  registerUserService,
  loginService,
  // getAllUsersService,
  // updateUserService,
  // updatePasswordService,
  // getAllUsersWithPendingService,
  // registerAdminService,
  // registerHeadService,
  // registerSuperAdminService,
  // registerSuperService,
  // getAllUsersWithPendingAdminService,
  // getAllUsersWithPendingHeadService,
  // resetEmailPasswordService,
  // resetPasswordService,
  // getAllAdminBySeenService,
  // removeIsSeenService,
  // sendBulkEmailService,
  // getSectorNameService,
  // getNumberReportService,
  // resetUserPasswordService,
  // getPendingUsersBySectorService
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
    const { first_name, last_name, email, phone_number, password } = req.body;


    const newUser = await registerUserService(
      first_name,
      last_name,
      email,
      phone_number,
      password
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

// const getAllUsersController = async (req, res, next) => {
//   try {
//     // Call the service to get all users

//     const users = await getAllUsersService();

//     // Respond with the list of users
//     res.status(200).json({
//       success: true,
//       message: "Users retrieved successfully",
//       users,
//     });
//   } catch (error) {
//     // Pass any error to the error handling middleware
//     next(error);
//   }
// };

// const updateUserController = async (req, res, next) => {
//   try {
//     const { firstName, lastName,email, phoneNumber } = req.body;
//     const userId = req.user.payload.userId; // Get user ID from the token

//     const updatedUser = await updateUserService(
//       userId,
//       firstName,
//       lastName,
//       email,
//       phoneNumber
//     );

//     return res.status(200).json({ success: true, data: updatedUser });
//   } catch (error) {
//     next(error);
//   }
// };


// const updateUserPasswordController = async (req, res, next) => {
//   // const userId = req.user.id; // Assuming `req.user` has the authenticated user info
//   const { currentPassword, newPassword } = req.body;
//   const userId = req.user.payload.userId;

//   try {
//     const result = await updatePasswordService(
//       userId,
//       currentPassword,
//       newPassword
//     );
//     res.status(200).json({ success: true, data: result });
//   } catch (error) {
//     next(error);
//   }
// };



// const resetEmailPasswordController = async (req, res, next) => {
//   // const userId = req.user.id; // Assuming `req.user` has the authenticated user info
//   const { email } = req.body;

//   try {
//     const result = await resetEmailPasswordService(email);
//     res.status(200).json({ success: true, message: result });
//   } catch (error) {
//     next(error);
//   }
// };
// const resetPasswordController = async (req, res, next) => {
//   // const userId = req.user.id; // Assuming `req.user` has the authenticated user info
//   const { password } = req.body;
//   const userId = req.user.id;
//   console.log(userId);

//   try {
//     const result = await resetPasswordService(userId, password);
//     res.status(200).json({ success: true, message: result });
//   } catch (error) {
//     next(error);
//   }
// };





// const sendBulkEmailController = async (req, res, next) => {
//   try {
//     const { subject, message, recipients } = req.body;

//     // Call the service to send the emails
//     const result = await sendBulkEmailService({ subject, message, recipients });

//     res.status(200).json({
//       success: true,
//       message: `Email sent to ${recipients.length} recipient(s).`,
//       result,
//     });
//   } catch (error) {
//     next(error);
//   }
// };



// const resetUserPasswordController = async (req, res, next) => {
//   try {
//     const { phoneNumber } = req.params;

//     const result = await resetUserPasswordService(phoneNumber);

//     res.status(200).json({
//       success: true,
//       message: `Password reset successfully to Password@123`,
//       data: result,
//     });
//   } catch (error) {
//     next(error);
//   }
// };



module.exports = {
  userRegistrationController,
  authUserController,
  
  // getAllUsersController,

  // updateUserController,
  // updateUserPasswordController,
  // getAllUsersWithPendingStatusController,
  // getAllUsersWithPendingStatusAdminController,
  // getAllUsersWithPendingStatusHeadController,
  // resetEmailPasswordController,
  // resetPasswordController,
  // getAllAdminBySeenController,
  // removeIsSeenController,
  // sendBulkEmailController,
  // getSectorNameController,
  // getNumberReportController,
  // resetUserPasswordController,

};
