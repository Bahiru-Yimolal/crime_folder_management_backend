const {
  User,
  AdministrativeUnit,
  Role,
  Permission,
  UserAssignment,
  UserPermission,
  CrimeFolder,
  CrimeFolderAttachment,
  AuditLog,
} = require("../models");

const { hashPassword, comparePassword } = require("../utils/hashUtils");
const { AppError } = require("../middlewares/errorMiddleware");
const { Op } = require("sequelize");
const generateToken = require("../utils/tokenUtil");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail"); // Utility to send emails
const { JWT_SECRET, RESET_PASSWORD_TOKEN_EXPIRY, CLIENT_URL } = process.env;

const registerUserService = async (
  first_name,
  last_name,
  email,
  phone_number,
  password
) => {
  try {
    // ✅ Check duplicates in parallel
    const existingUserphone= await User.findOne({ where: { phone_number } })

    if (existingUserphone)
      throw new AppError("User with this phone number already exists", 400);
    // if (existingUseremail)
    //   throw new AppError("User with this Email Address already exists", 400);

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Check if this is the first user
    const firstUser = !(await User.findOne());

    // Create user
    const user = await User.create({
      first_name,
      last_name,
      email,
      phone_number,
      password: hashedPassword,
      status: firstUser ? "ACTIVE" : "UNASSIGNED",
    });

    // ----------- Bootstrap first user -------------
    if (firstUser) {
      // Ethiopia unit
      const [ethiopiaUnit] = await AdministrativeUnit.findOrCreate({
        where: { level: "ETHIOPIA" },
        defaults: { name: "Ethiopia", parent_id: null },
      });

      // Admin role
      const [adminRole] = await Role.findOrCreate({
        where: { name: "ADMIN" },
        defaults: { description: "Admin role" },
      });

      // Assign user to Ethiopia unit as Admin
      const userAssignment = await UserAssignment.create({
        user_id: user.user_id,
        unit_id: ethiopiaUnit.id,
        role_id: adminRole.id,
      });

      // Ensure permissions exist
      const permissionNames = [
        "CREATE_FOLDER",
        "READ_FOLDER",
        "UPDATE_FOLDER",
        "DELETE_FOLDER",
        "ADMIN_PERMISSIONS",
      ];

      const permissions = await Promise.all(
        permissionNames.map((name) =>
          Permission.findOrCreate({
            where: { name },
            defaults: { description: `${name.replace(/_/g, " ").toLowerCase()}` },
          }).then(([perm]) => perm)
        )
      );

      // Assign all permissions to super admin
      await Promise.all(
        permissions.map((perm) =>
          UserPermission.create({
            assignment_id: userAssignment.id,
            permission_id: perm.id,
          })
        )
      );
    }

    return user;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Database error: Unable to create user", 500);
  }
};


const loginService = async (phone_number, password) => {
  // 1️⃣ Find user by phone number
  const user = await User.findOne({ where: { phone_number } });
  if (!user) throw new AppError("Invalid credentials", 401);

  // 2️⃣ Check password
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new AppError("Invalid credentials", 401);

  // 3️⃣ Check if user is assigned
  if (user.status === "UNASSIGNED") {
    return {
      message: "Your account is pending assignment",
      status: "UNASSIGNED",
    };
  }

  // 4️⃣ Fetch all assignments for this user
  const assignments = await UserAssignment.findAll({
    where: { user_id: user.user_id },
    include: [
      { model: Role, attributes: ["name", "description"] },
      { model: AdministrativeUnit, attributes: ["id", "name", "level"] },
    ],
  });

  // 5️⃣ Fetch permissions for all assignments
  const permissions = await UserPermission.findAll({
    where: { assignment_id: assignments.map(a => a.id) },
    include: [{ model: Permission, attributes: ["name"] }],
  });

  // Flatten permissions into array of names
  const permissionList = permissions.map(p => p.Permission.name);

  // 6️⃣ Generate JWT token
  const tokenPayload = {
    user_id: user.user_id,
    status: user.status,
    assignments: assignments.map(a => ({
      assignment_id: a.id,
      role: a.Role.name,
      unit: { id: a.AdministrativeUnit.id, name: a.AdministrativeUnit.name, level: a.AdministrativeUnit.level },
    })),
    permissions: permissionList,
  };

  const token = generateToken(tokenPayload);

  return {
    token,
    user: {
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      phone_number: user.phone_number,
      email: user.email,
      status: user.status,
    },
    assignments: tokenPayload.assignments,
    permissions: permissionList,
  };
};

// const getAllUsersWithPendingService = async () => {
//   try {
//     // Fetch all registered users
//     const users = await User.findAll({
//       where: { status: "pending", role: "Super" }, // Filter for users with pending status
//       attributes: [
//         "user_id",
//         "first_name",
//         "last_name",
//         "phone_number",
//         "status",
//       ], // Only these fields will be selected
//     });


//     if (!users || users.length === 0) {
//       throw new AppError("No users found", 404); // If no users are found
//     }

//     return users;
//   } catch (error) {

//     throw new AppError(
//       error.message || "Database error: Unable to fetch users",
//       500
//     );
//   }
// };

// const getAllUsersWithPendingAdminService = async () => {
//   try {
//     // Fetch all registered users
//     const users = await User.findAll({
//       where: { status: "pending", role: "Admin" }, // Filter for users with pending status
//       attributes: [
//         "user_id",
//         "first_name",
//         "last_name",
//         "phone_number",
//         "status",
//       ], // Only these fields will be selected
//     });

//     if (!users || users.length === 0) {
//       throw new AppError("No users found", 404); // If no users are found
//     }

//     return users;
//   } catch (error) {
//     throw new AppError(
//       error.message || "Database error: Unable to fetch users",
//       500
//     );
//   }
// };

// const getAllUsersWithPendingHeadService = async () => {
//   try {
//     // Fetch all registered users
//     const users = await User.findAll({
//       where: { status: "pending", role: "Head" }, // Filter for users with pending status
//       attributes: [
//         "user_id",
//         "first_name",
//         "last_name",
//         "phone_number",
//         "status",
//       ], // Only these fields will be selected
//     });

//     if (!users || users.length === 0) {
//       throw new AppError("No users found", 404); // If no users are found
//     }

//     return users;
//   } catch (error) {
//     throw new AppError(
//       error.message || "Database error: Unable to fetch users",
//       500
//     );
//   }
// };


// const resetEmailPasswordService = async (email) => {
//   const existingUser = await User.findOne({ where: { email } });

//   if (!existingUser) {
//     throw new AppError("No user found with this email", 404);
//   }

//   // Generate reset token (expires in 15 minutes or so)
//   const token = jwt.sign(
//     { id: existingUser.user_id, email: existingUser.email },
//     JWT_SECRET,
//     { expiresIn: RESET_PASSWORD_TOKEN_EXPIRY || "15m" }
//   );

//   // Construct reset link
//   const resetLink = `${CLIENT_URL}/reset-password/${token}`;

//   // console.log(token);

//   // Send email
//   const subject = "Password Reset Request";
//   const html = `
//   <!DOCTYPE html>
//   <html>
//   <head>
//       <style>
//           body {
//               font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//               line-height: 1.6;
//               color: #333;
//               max-width: 600px;
//               margin: 0 auto;
//               padding: 20px;
//               background-color: #f9f9f9;
//           }
//           .header {
//               text-align: center;
//               padding: 10px 0;
//               background-color: #0f766e;
//               color: white;
//               border-radius: 8px 8px 0 0;
//           }
//           .logo {
//               font-size: 24px;
//               font-weight: bold;
//               color: #ffffff;
//           }
//           .content {
//               background-color: white;
//               padding: 20px;
//               border-radius: 0 0 8px 8px;
//               box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
//           }
//           .button {
//               display: inline-block;
//               padding: 12px 24px;
//               background-color: #0f766e;
//               color: #ffffff !important;
//               text-decoration: none;
//               border-radius: 5px;
//               font-weight: bold;
//               margin: 15px 0;
//               text-align: center;
//           }
//           .footer {
//               text-align: center;
//               margin-top: 20px;
//               font-size: 12px;
//               color: #777;
//           }
//           .highlight {
//               color: #E74C3C;
//               font-weight: bold;
//           }
//       </style>
//   </head>
//   <body>
//       <div class="header">
//           <div class="logo">Addis Ababa Coders</div>
//           <p>Empowering the Future of Tech in Ethiopia</p>
//       </div>
//       <div class="content">
//           <p>Hello <strong>${existingUser.first_name} ${
//     existingUser.last_name
//   }</strong>,</p>
          
//           <p>We received a request to reset your password for your <strong>Addis Ababa Coders</strong> account. No worries—let’s get you back on track!</p>
          
//           <p style="text-align: center;">
//               <a href="${resetLink}" class="button">Reset Your Password</a>
//           </p>
          
//           <p>For security reasons, this link will <span class="highlight">expire in 5 minutes</span>. If you didn’t request this, please ignore this email—your account is still safe with us.</p>
          
//           <p>Keep coding, keep innovating! 🚀</p>
          
//           <p>Best regards,<br>Addis Ababa Coders Management System</p>
//       </div>
//       <div class="footer">
//           <p>© ${new Date().getFullYear()} Addis Ababa Coders Management System. All rights reserved.</p>
//           <p>Addis Ababa, Ethiopia</p>
//       </div>
//   </body>
//   </html>
//   `;
  

//  const emailAddress =  existingUser.email;


//   try {
//     await sendEmail(emailAddress, subject, html);
//   } catch (emailError) {
//     console.error("Email sending failed:", emailError.message);
//     // You can choose whether to throw or silently ignore
//   }
  

//   return { message: "Reset email sent successfully" };
// };

// const resetPasswordService = async (userId,password) => {
//   const existingUser = await User.findOne({
//     where: { user_id:userId },
//   });

//   if (!existingUser) {
//     throw new AppError("No user found with this userId", 404);
//   }
//   const hashedPassword = await hashPassword(password);
//   await existingUser.update({
//     password: hashedPassword,
//   });

//   return {
//     message: "Password reset successful",
//   };
 
// };

// const getAllAdminBySeenService = async () => {
//   try {
//     const admins = await User.findAll({
//       where: {
//         role: {
//           [Op.in]: ["Admin", "Head"], // Fetch users with role 'admin' or 'head'
//         },
//         status: "pending",
//         isSeen: false,
//       },
//       order: [["user_id", "ASC"]],
//     });

//     return admins;
//   } catch (error) {
//     throw new Error("Failed to retrieve unseen admins: " + error.message);
//   }
// };


// const removeIsSeenService = async (user_id) => {
//   // First, find the user
//   const user = await User.findOne({ where: { user_id } });

//   if (!user || user.isSeen === true) {
//     return null;
//   }

//   // Update isSeen to true
//   user.isSeen = true;
//   await user.save();

//   return user;
// };

// const sendBulkEmailService = async ({ subject, message, recipients }) => {
//   const BATCH_SIZE = 50;
//   const results = [];

//   const generateHtml = (name, message) => {
//     return `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
//   <style>
//     body {
//       font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//       margin: 0;
//       padding: 0;
//       background: #f4f4f4;
//     }
//     .container {
//       max-width: 600px;
//       margin: 20px auto;
//       background: #fff;
//       padding: 30px;
//       border-radius: 10px;
//       box-shadow: 0 0 10px rgba(0,0,0,0.1);
//     }
//     .header {
//       background: #0f766e;
//       color: #fff;
//       padding: 20px;
//       text-align: center;
//       border-radius: 10px 10px 0 0;
//     }
//     .content {
//       padding: 20px;
//       text-align: left;
//       color: #333;
//     }
//     .button {
//       display: inline-block;
//       padding: 12px 24px;
//       background: #0f766e;
//       color: white;
//       text-decoration: none;
//       border-radius: 5px;
//       margin-top: 20px;
//       font-weight: bold;
//       color: #ffffff !important;
//     }
//     .footer {
//       font-size: 12px;
//       color: #999;
//       text-align: center;
//       padding: 10px;
//       margin-top: 20px;
//     }
//     @media (max-width: 600px) {
//       .container {
//         padding: 20px;
//       }
//     }
//   </style>
// </head>
// <body>
//   <div class="container">
//     <div class="header">
//       <h2>Addis Ababa Coders</h2>
//       <p>Empowering the Future of Tech</p>
//     </div>
//     <div class="content">
//       <p>Dear <strong>${name}</strong>,</p>
//       <p>${message}</p>
//       <p style="margin-top: 30px;">Keep learning, keep building! 🚀</p>
//       <a class="button" href="https://aacoders.aaitdb.gov.et/">Visit Our Website</a>
//     </div>
//     <div class="footer">
//       <p>© ${new Date().getFullYear()} Addis Ababa Coders Management System. All rights reserved.</p>
//     </div>
//   </div>
// </body>
// </html>
//     `;
//   };

//   for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
//     const batch = recipients.slice(i, i + BATCH_SIZE);

//     try {
//       for (const recipient of batch) {
//         const html = generateHtml(recipient.full_name, message);
//         await sendEmail(recipient.email, subject, html);
//       }

//       results.push({ batch, status: "sent" });
//     } catch (error) {
//       console.error(`Batch ${i / BATCH_SIZE + 1} failed:`, error.message);
//       results.push({ batch, status: "failed", error: error.message });
//     }

//     // Optional rate-limiting delay
//     await new Promise((res) => setTimeout(res, 2000));
//   }

//   return results;
// };

// const getSectorNameService = async (id, role) => {
//   if (role === "Sector Leader") {
//     const sector = await Sector.findByPk(id);
//     if (!sector) {
//       throw new AppError("Sector not found", 404);
//     }
//     return sector.sector_name;
//   }

//   if (role === "Sub-City Head") {
//     const subCity = await Subcity.findByPk(id);
//     if (!subCity) {
//       throw new AppError("Sub-City not found", 404);
//     }
//     return subCity.subcity_name;
//   }

//   if (role === "Committee") {
//     const committee = await Committee.findByPk(id);
//     if (!committee) {
//       throw new AppError("Committee not found", 404);
//     }
//     return committee.committee_name;
//   }

//   throw new AppError("Invalid role", 400);
// };

// const getNumberReportService = async () => {
//   // Total coders
//   const total_coders = await Profile.count();

//   // Female and male coders (assuming gender field exists)
//   const female_coders = await Profile.count({ where: { sex: "female" } });
//   const male_coders = await Profile.count({ where: { sex: "male" } });

//   // Admins with role 'Admin' and status 'assigned'
//   const admin_count = await User.count({
//     where: {
//       role: "Admin",
//       status: "assigned",
//     },
//   });

//   // Heads with role 'Head' and status 'assigned'
//   const head_count = await User.count({
//     where: {
//       role: "Head",
//       status: "assigned",
//     },
//   });

//   // Total events
//   const total_events = await Event.count();

//   // Pending events
//   const pending_events = await Event.count({ where: { state: "upcoming" } });

//   // Done events
//   const done_events = await Event.count({ where: { state: "done" } });

//   // Total sectors
//   const total_sectors = await Sector.count();

//   return {
//     total_coders,
//     female_coders,
//     male_coders,
//     admin_count,
//     head_count,
//     total_events,
//     pending_events,
//     done_events,
//     total_sectors,
//   };
// };

// const resetUserPasswordService = async (phoneNumber) => {
//   const sectorLeader =  await User.findOne({
//     where: { phone_number: phoneNumber },
//   });
//   if (!sectorLeader) {
//     throw new Error("User not found");
//   }

//   const hashedPassword = await hashPassword(process.env.DEFAULT_PASSWORD);
//   sectorLeader.password = hashedPassword;
//   await sectorLeader.save();

//   return sectorLeader;
//   console.log(sectorLeader);
// };

// const getPendingUsersBySectorService = async (sectorName) => {
//   if (!sectorName) throw new AppError("Sector name is required", 400);

//   const users = await User.findAll({
//     where: {
//       sector: sectorName,
//       status: "pending",
//     },
//     attributes: [
//       "user_id",
//       "first_name",
//       "last_name",
//       "email",
//       "phone_number",
//       "sector",
//       "status",
//       "role",
//       "createdAt",
//     ],
//     order: [["createdAt", "DESC"]],
//   });

//   if (users.length === 0) {
//     throw new AppError(`No pending users found in sector: ${sectorName}`, 404);
//   }

//   return users;
// };

module.exports = {
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
};
