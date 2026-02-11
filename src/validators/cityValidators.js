const Joi = require("joi");

// Define the group validation schema
const citySchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "City name is required",
    "any.required": "City name is required",
  }),
});

// Middleware for validating group input
const validateCityInput = (req, res, next) => {
  const { error } = citySchema.validate(req.body);

  if (error) {
    // If validation fails, send an error response
    return res.status(400).json({ error: error.details[0].message });
  }

  // If validation passes, proceed to the next middleware
  next();
};
// Define assign user validation schema
const assignUserSchema = Joi.object({
  userId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.empty": "User ID is required",
      "any.required": "User ID is required",
      "string.guid": "User ID must be a valid UUID",
    }),

  cityId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.empty": "City ID is required",
      "any.required": "City ID is required",
      "string.guid": "City ID must be a valid UUID",
    }),

  permissions: Joi.array()
    .items(Joi.string())
    .optional()
    .messages({
      "array.base": "Permissions must be an array of strings",
    }),
});

// Middleware for validating assign user input
const validateAssignUserInput = (req, res, next) => {
  const { error } = assignUserSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};



const createEthiopiaUserSchema = Joi.object({
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

// Middleware for validating assign user input
const validateCreateEthiopiaUserInput = (req, res, next) => {
  const { error } = createEthiopiaUserSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

const unassignUserSchema = Joi.object({
  userId: Joi.string().uuid().required().messages({
    "string.empty": "User ID is required",
    "string.guid": "User ID must be a valid UUID",
    "any.required": "User ID is required",
  }),
});

// Middleware to validate input
const validateUnassignUserInput = (req, res, next) => {
  const { error } = unassignUserSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

// Schema for updating user permissions
const updatePermissionsSchema = Joi.object({
  userId: Joi.string().uuid().required().messages({
    "string.empty": "User ID is required",
    "string.guid": "User ID must be a valid UUID",
    "any.required": "User ID is required",
  }),
  permissions: Joi.array()
    .items(Joi.string())
    .required()
    .messages({
      "array.base": "Permissions must be an array of permission names",
    }),
});

// Middleware to validate input
const validateUpdatePermissionsInput = (req, res, next) => {
  const { error } = updatePermissionsSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

const createServiceSchema = Joi.object({
  type: Joi.string().required().messages({
    "string.empty": "Service type is required",
    "any.required": "Service type is required",
  }),
  place: Joi.string().required().messages({
    "string.empty": "Service place is required",
    "any.required": "Service place is required",
  }),
  duration: Joi.number().integer().min(1).required().messages({
    "number.base": "Duration must be a number",
    "number.min": "Duration must be at least 1 minute",
    "any.required": "Duration is required",
  }),
  quality_standard: Joi.number().optional(),
  delivery_mode: Joi.string().required().messages({
    "string.empty": "Delivery mode is required",
    "any.required": "Delivery mode is required",
  }),
  preconditions: Joi.array().items(Joi.string()).optional(),
  paymentAmount: Joi.string().optional().messages({
    "string.base": "Payment amount must be a string",
  }),
  completion_metric: Joi.string()
    .valid("OFFICER", "CITIZEN", "BOTH_AVERAGE")
    .optional()
    .messages({
      "any.only": "Invalid completion metric. Must be OFFICER, CITIZEN, or BOTH_AVERAGE",
    }),
  groupLeaderIds: Joi.array().items(Joi.string().uuid()).optional().messages({
    "array.base": "Group Leader IDs must be an array of UUIDs",
  }),
});

const validateCreateServiceInput = (req, res, next) => {
  const { error } = createServiceSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

const updateServiceSchema = Joi.object({
  type: Joi.string().optional(),
  place: Joi.string().optional(),
  duration: Joi.number().integer().min(1).optional(),
  quality_standard: Joi.number().optional(),
  delivery_mode: Joi.string().optional(),
  preconditions: Joi.array().items(Joi.string()).optional(),
  paymentAmount: Joi.string().optional(),
  completion_metric: Joi.string().valid("OFFICER", "CITIZEN", "BOTH_AVERAGE").optional(),
  groupLeaderIds: Joi.array().items(Joi.string().uuid()).optional(),
});

const validateUpdateServiceInput = (req, res, next) => {
  const { error } = updateServiceSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

const createServiceRequestSchema = Joi.object({
  service_id: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "string.empty": "Service ID is required",
    "string.guid": "Invalid Service ID format",
  }),
  user_phone: Joi.string()
    .pattern(/^[0-9+]{10,15}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Invalid phone number format",
    }),
});

const validateCreateServiceRequestInput = (req, res, next) => {
  const { error } = createServiceRequestSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

module.exports = {
  validateCityInput,
  validateAssignUserInput,
  validateCreateEthiopiaUserInput,
  validateUnassignUserInput,
  validateUpdatePermissionsInput,
  validateCreateServiceInput,
  validateUpdateServiceInput,
  validateCreateServiceRequestInput,
};
