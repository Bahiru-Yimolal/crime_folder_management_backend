const Joi = require("joi");

// Define the sector validation schema
const sectorSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Sector name is required",
    "any.required": "Sector name is required",
  }),
});

// Define assign sector admin validation schema
const assignSectorAdminSchema = Joi.object({
  userId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.empty": "User ID is required",
      "any.required": "User ID is required",
      "string.guid": "User ID must be a valid UUID",
    }),

  sectorId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.empty": "Sector ID is required",
      "any.required": "Sector ID is required",
      "string.guid": "Sector ID must be a valid UUID",
    }),

  permissions: Joi.array()
    .items(Joi.string())
    .optional()
    .messages({
      "array.base": "Permissions must be an array of strings",
    }),
});

// Middleware for validating sector input
const validateSectorInput = (req, res, next) => {
  const { error } = sectorSchema.validate(req.body);

  if (error) {
    // If validation fails, send an error response
    return res.status(400).json({ error: error.details[0].message });
  }

  // If validation passes, proceed to the next middleware
  next();
};

// Middleware for validating assign sector admin input
const validateAssignSectorAdminInput = (req, res, next) => {
  const { error } = assignSectorAdminSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

// Define create sector user schema
const createSectorUserSchema = Joi.object({
  user_id: Joi.string().uuid().required().messages({
    "any.required": "User ID is required",
    "string.guid": "User ID must be a valid UUID",
  }),

  role: Joi.string()
    .required()
    .messages({
      "any.required": "Role is required",
    }),

  permissions: Joi.array()
    .items(Joi.string())
    .optional()
    .messages({
      "array.base": "Permissions must be an array of strings",
    }),
});

// Middleware for validating create sector user input
const validateCreateSectorUserInput = (req, res, next) => {
  const { error } = createSectorUserSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

module.exports = {
  validateSectorInput,
  validateAssignSectorAdminInput,
  validateCreateSectorUserInput,
  
};
