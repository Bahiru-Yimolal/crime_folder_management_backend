const Joi = require("joi");

// Define the validation schema
const userSchema = Joi.object({
  first_name: Joi.string().min(1).max(30).required().messages({
    "string.empty": "First name is required.",
    "string.min": "First name must be at least 1 characters long.",
    "string.max": "First name must be less than or equal to 30 characters.",
  }),
  last_name: Joi.string().min(1).max(30).required().messages({
    "string.empty": "Last name is required.",
    "string.min": "Last name must be at least 1 characters long.",
    "string.max": "Last name must be less than or equal to 30 characters.",
  }),
  email: Joi.string()
    .email() 
    .allow(null, "")
    .messages({
      "string.empty": "Email is required.",
      "string.email": "Please enter a valid email address.",
    }),
  phone_number: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.empty": "Phone number is required.",
      "string.length": "Phone number must be exactly 10 digits long.",
      "string.pattern.base": "Phone number must contain only numbers.",
    }),
  sector: Joi.string().required(),
  password: Joi.string()
    .min(8) // Minimum 8 characters
    .pattern(new RegExp("(?=.*[a-z])")) // At least one lowercase letter
    .pattern(new RegExp("(?=.*[A-Z])")) // At least one uppercase letter
    .pattern(new RegExp("(?=.*[0-9])")) // At least one number
    .pattern(new RegExp("(?=.*[!@#$%^&*])")) // At least one special character
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long.",
      "string.pattern.base":
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      "any.required": "Password is required.",
    }),
});

// Middleware to validate user data
const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    // Map the technical Joi error message to a user-friendly one
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  next(); // Proceed if validation succeeds
};
const updateUserSchema = Joi.object({
  firstName: Joi.string().min(1).max(30).required().messages({
    "string.empty": "First name is required.",
    "string.min": "First name must be at least 1 characters long.",
    "string.max": "First name must be less than or equal to 30 characters.",
  }),
  lastName: Joi.string().min(1).max(30).required().messages({
    "string.empty": "Last name is required.",
    "string.min": "Last name must be at least 1 characters long.",
    "string.max": "Last name must be less than or equal to 30 characters.",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required.",
      "string.email": "Please enter a valid email address.",
    }),
  phoneNumber: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.empty": "Phone number is required.",
      "string.length": "Phone number must be exactly 10 digits long.",
      "string.pattern.base": "Phone number must contain only numbers.",
    }),
});

const validateUserUpdate = (req, res, next) => {
  const { error } = updateUserSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  next();
};

const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .min(8) // Minimum 8 characters
    .pattern(new RegExp("(?=.*[a-z])")) // At least one lowercase letter
    .pattern(new RegExp("(?=.*[A-Z])")) // At least one uppercase letter
    .pattern(new RegExp("(?=.*[0-9])")) // At least one number
    .pattern(new RegExp("(?=.*[!@#$%^&*])")) // At least one special character
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long.",
      "string.pattern.base":
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      "any.required": "Password is required.",
    }),
  newPassword: Joi.string()
    .min(8) // Minimum 8 characters
    .pattern(new RegExp("(?=.*[a-z])")) // At least one lowercase letter
    .pattern(new RegExp("(?=.*[A-Z])")) // At least one uppercase letter
    .pattern(new RegExp("(?=.*[0-9])")) // At least one number
    .pattern(new RegExp("(?=.*[!@#$%^&*])")) // At least one special character
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long.",
      "string.pattern.base":
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      "any.required": "Password is required.",
    }),
  userId: Joi.number().integer().optional().messages({
    "number.base": "New Group Leader ID must be a number.",
  }),
});
const validatePassword = (req, res, next) => {
  const { error } = updatePasswordSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  next();
};

const loginSchema = Joi.object({
  phone_number: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.empty": "Phone number is required.",
      "string.length": "Phone number must be exactly 10 digits long.",
      "string.pattern.base": "Phone number must contain only numbers.",
    }),
  password: Joi.string()
    .min(8) // Minimum 8 characters
    .pattern(new RegExp("(?=.*[a-z])")) // At least one lowercase letter
    .pattern(new RegExp("(?=.*[A-Z])")) // At least one uppercase letter
    .pattern(new RegExp("(?=.*[0-9])")) // At least one number
    .pattern(new RegExp("(?=.*[!@#$%^&*])")) // At least one special character
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long.",
      "string.pattern.base":
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      "any.required": "Password is required.",
    }),
});

const validateLoginInfo = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  next();
};

const validateEmailUserSchema = Joi.object({

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required.",
      "string.email": "Please enter a valid email address.",
    }),
});

const validateEmail = (req, res, next) => {
  const { error } = validateEmailUserSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  next();
};

const validatePasswordUserSchema = Joi.object({
  password: Joi.string()
    .min(8) // Minimum 8 characters
    .pattern(new RegExp("(?=.*[a-z])")) // At least one lowercase letter
    .pattern(new RegExp("(?=.*[A-Z])")) // At least one uppercase letter
    .pattern(new RegExp("(?=.*[0-9])")) // At least one number
    .pattern(new RegExp("(?=.*[!@#$%^&*])")) // At least one special character
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long.",
      "string.pattern.base":
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      "any.required": "Password is required.",
    }),
});

const validateResetPassword = (req, res, next) => {
  const { error } = validatePasswordUserSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  next();
};



const validateEmailAttributesSchema = Joi.object({
  subject: Joi.string().min(3).max(255).required().messages({
    "string.base": "Subject must be a string.",
    "string.empty": "Subject cannot be empty.",
    "string.min": "Subject must be at least 3 characters long.",
    "string.max": "Subject must not exceed 255 characters.",
    "any.required": "Subject is required.",
  }),

  message: Joi.string().min(5).required().messages({
    "string.base": "Message must be a string.",
    "string.empty": "Message cannot be empty.",
    "string.min": "Message must be at least 5 characters long.",
    "any.required": "Message is required.",
  }),

  recipients: Joi.array()
    .items(
      Joi.object({
        full_name: Joi.string().min(1).required().messages({
          "string.base": "Full name must be a string.",
          "string.empty": "Full name is required.",
          "any.required": "Full name is required.",
        }),
        email: Joi.string().email().required().messages({
          "string.email": "Email must be a valid email address.",
          "any.required": "Email is required.",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Recipients must be an array of recipient objects.",
      "array.min": "At least one recipient is required.",
      "any.required": "Recipients field is required.",
    }),
});

const validateEmailAttributes = (req, res, next) => {
  const { error } = validateEmailAttributesSchema.validate(req.body, {
    abortEarly: true,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

module.exports = {
  validateUser,
  validateUserUpdate,
  validatePassword,
  validateLoginInfo,
  validateEmail,
  validateResetPassword,
  validateEmailAttributes,
};
