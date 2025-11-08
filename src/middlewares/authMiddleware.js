const jwt = require("jsonwebtoken");
const { AppError } = require("../middlewares/errorMiddleware");
const Role = require("../models/roleModel");

const protect = (req, res, next) => {
  // Get token from header
  const token =
    req.headers.authorization && req.headers.authorization.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null;

  // Check if token exists
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new AppError("Invalid token. Please log in again.", 401));
    }

    // Attach user data to request object
    req.user = decoded; // assuming your token contains user info
    next();
  });
};

const verifyUserRole = async (req, res, next) => {
  const userId = req.user.payload.userId;

  // Retrieve the latest role assigned to the user based on the `created_at` timestamp
  const latestRole = await Role.findOne({
    where: { user_id: userId },
    order: [["created_at", "DESC"]], // Order by the most recent assignment
  });

  // console.log(latestRole);

  if (!latestRole) {
    return next(
      new AppError("Role information not found. Please log in again.", 403)
    );
  }

  // Check if the user is a Group Leader or Professional
  const allowedRoles = ["Sub-City Head", "Sector Leader"];
  if (!allowedRoles.includes(latestRole.categories)) {
    return next(new AppError("Access denied. Invalid role.", 403));
  }

  // Add role information to the request for downstream use
  req.user.role = latestRole.categories;

  next();
};


const verifySubcityLeader = async (req, res, next) => {
  const userId = req.user.payload.userId;

  // console.log(req.user);

  // Retrieve the latest role assigned to the user based on created_at timestamp
  const latestRole = await Role.findOne({
    where: { user_id: userId },
    order: [["created_at", "DESC"]], // Order by the most recent assignment
  });

  // console.log(latestRole.categories);

  if (!latestRole || latestRole.categories !== "Sub-City Head") {
    return next(new AppError("Please Login As a Sub city leader.", 403));
  }

  next();
};

const verifySectorLeader = async (req, res, next) => {

  const userId = req.user.payload.userId;
  // console.log(req.user);

  // Retrieve the latest role assigned to the user based on created_at timestamp
  const latestRole = await Role.findOne({
    where: { user_id: userId },
    order: [["created_at", "DESC"]], // Order by the most recent assignment
  });

  // console.log(latestRole.categories);

  if (!latestRole || latestRole.categories !== "Sector Leader") {
    return next(new AppError("Please Login As a Sector leader.", 403));
  }

  next();
};

const verifyAdmin = async (req, res, next) => {
  const userId = req.user.payload.userId;

  // console.log(req.user);

  // Retrieve the latest role assigned to the user based on created_at timestamp
  const latestRole = await Role.findOne({
    where: { user_id: userId },
    order: [["created_at", "DESC"]], // Order by the most recent assignment
  });

  // console.log(latestRole.categories);

  if (!latestRole || latestRole.categories !== "Admin") {
    return next(new AppError("Please Login As an Admin.", 403));
  }

  next();
};

const verifyRealUserRole = async (req, res, next) => {
  const userId = req.user.payload.userId;

  console.log(req.user);

  // Retrieve the latest role assigned to the user based on created_at timestamp
  const latestRole = await Role.findOne({
    where: { user_id: userId.userId },
    order: [["created_at", "DESC"]], // Order by the most recent assignment
  });

  // console.log(latestRole.categories);

  if (!latestRole || latestRole.categories !== "user") {
    return next(new AppError("Please Login As a User.", 403));
  }

  next();
};



const verifyCommittee = async (req, res, next) => {
  const userId = req.user.payload.userId;

  // console.log(req.user);

  // Retrieve the latest role assigned to the user based on created_at timestamp
  const latestRole = await Role.findOne({
    where: { user_id: userId },
    order: [["created_at", "DESC"]], // Order by the most recent assignment
  });

  // console.log(latestRole.categories);

  if (!latestRole || latestRole.categories !== "Committee") {
    return next(new AppError("Please Login As a Committee.", 403));
  }

  next();
};

module.exports = {
  protect,
  verifySubcityLeader,
  verifySectorLeader,
  verifyAdmin,
  verifyUserRole,
  verifyRealUserRole,
  verifyCommittee,
};
