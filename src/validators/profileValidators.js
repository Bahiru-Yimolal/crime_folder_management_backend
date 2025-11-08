const Joi = require("joi");

const validateProfileSchema = Joi.object({
  // Personal Info
  firstName: Joi.string().required().messages({
    "string.empty": "First name is required",
    "any.required": "First name is required",
  }),
  middleName: Joi.string().required().messages({
    "string.empty": "Middle name is required",
    "any.required": "Middle name is required",
  }),
  lastName: Joi.string().required().messages({
    "string.empty": "Last name is required",
    "any.required": "Last name is required",
  }),
  sex: Joi.string().required().messages({
    "string.empty": "Sex is required",
    "any.required": "Sex is required",
  }),
  dateOfBirth: Joi.date().iso().required().messages({
    "date.base": "Date of birth must be a valid date",
    "date.format": "Date of birth must be in YYYY-MM-DD format",
    "any.required": "Date of birth is required",
  }),
  emailAddress: Joi.string().email().required().messages({
    "string.empty": "Email address is required",
    "string.email": "Email must be a valid email address",
    "any.required": "Email address is required",
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
  subcity: Joi.string().required().messages({
    "string.empty": "Subcity is required",
    "any.required": "Subcity is required",
  }),
  workType: Joi.string().required().messages({
    "string.empty": "Work Type is required",
    "any.required": "Work Type is required",
  }),
  subcitySector: Joi.string().allow(null, ""),
  subcityCenter: Joi.string().allow(null, ""),
  educationLevel: Joi.string().allow(null, ""),
  educationType: Joi.string().allow(null, ""),
  profilePhoto: Joi.string().allow(null, ""),
});

const validateProfile = (req, res, next) => {
  const { error } = validateProfileSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const messages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: messages,
    });
  }

  next();
};

const validateWorkSchema = Joi.object({
  profile_id: Joi.string().required().messages({
    "string.empty": "profile_id is required",
    "any.required": "profile_id is required",
  }),
  organization: Joi.string().required().messages({
    "string.empty": "organization is required",
    "any.required": "organization is required",
  }),
  courseType: Joi.string().required().messages({
    "string.empty": "Course Type is required",
    "any.required": "Course Type is required",
  }),
  sector: Joi.string().required().messages({
    "string.empty": "Sector is required",
    "any.required": "Sector is required",
  }),
  isComplete: Joi.string().required().messages({
    "string.empty": "isComplete is required",
    "any.required": "isComplete subcity is required",
  }),
  date: Joi.date().iso().required().messages({
    "date.base": "Date of Cerfication must be a valid date",
    "date.format": "Date of Cerfication must be in YYYY-MM-DD format",
    "any.required": "Date of Cerfication is required",
  }),
  certificateLink: Joi.string().allow(null, ""),

  certificate: Joi.string().allow(null, ""),
});

const validateWork = (req, res, next) => {
  const { error } = validateWorkSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const messages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: messages,
    });
  }

  next();
};

const validateUpdateWorkSchema = Joi.object({
  organization: Joi.string().required().messages({
    "string.empty": "organization is required",
    "any.required": "organization is required",
  }),
  courseType: Joi.string().required().messages({
    "string.empty": "Course Type is required",
    "any.required": "Course Type is required",
  }),
  sector: Joi.string().required().messages({
    "string.empty": "Sector is required",
    "any.required": "Sector subcity is required",
  }),
  isComplete: Joi.string().required().messages({
    "string.empty": "isComplete is required",
    "any.required": "isComplete subcity is required",
  }),
  date: Joi.date().iso().required().messages({
    "date.base": "Date of Cerfication must be a valid date",
    "date.format": "Date of Cerfication must be in YYYY-MM-DD format",
    "any.required": "Date of Cerfication is required",
  }),
  certificateLink: Joi.string().allow(null, ""),
  certificate: Joi.string().allow(null, ""),
});

const validateUpdateWork = (req, res, next) => {
  const { error } = validateUpdateWorkSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const messages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: messages,
    });
  }

  next();
};

const validatePersonalInfoSchema = Joi.object({
  profile_id: Joi.string().required().messages({
    "string.empty": "profile_id is required",
    "any.required": "profile_id is required",
  }),
  // Personal Info
  firstName: Joi.string().required().messages({
    "string.empty": "First name is required",
    "any.required": "First name is required",
  }),
  middleName: Joi.string().required().messages({
    "string.empty": "Middle name is required",
    "any.required": "Middle name is required",
  }),
  lastName: Joi.string().required().messages({
    "string.empty": "Last name is required",
    "any.required": "Last name is required",
  }),
  sex: Joi.string().required().messages({
    "string.empty": "Sex is required",
    "any.required": "Sex is required",
  }),
  dateOfBirth: Joi.date().iso().required().messages({
    "date.base": "Date of birth must be a valid date",
    "date.format": "Date of birth must be in YYYY-MM-DD format",
    "any.required": "Date of birth is required",
  }),
  emailAddress: Joi.string().email().required().messages({
    "string.empty": "Email address is required",
    "string.email": "Email must be a valid email address",
    "any.required": "Email address is required",
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

  subcity: Joi.string().required().messages({
    "string.empty": "Subcity is required",
    "any.required": "Subcity is required",
  }),
  workType: Joi.string().required().messages({
    "string.empty": "Work Type is required",
    "any.required": "Work Type is required",
  }),
  subcitySector: Joi.string().allow(null, ""),
  subcityCenter: Joi.string().allow(null, ""),
  educationLevel: Joi.string().allow(null, ""),
  educationType: Joi.string().allow(null, ""),
});

const validatePersonalInfo = (req, res, next) => {
  const { error } = validatePersonalInfoSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const messages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: messages,
    });
  }

  next();
};

const validateEventSchema = Joi.object({
  // Personal Info
  title: Joi.string().min(3).required().messages({
    "string.base": "Title must be a string",
    "string.empty": "Title is required",
    "string.min": "Title must be at least 3 characters long",
    "any.required": "Title is required",
  }),

  subTitle: Joi.string().min(3).allow(null, "").optional().messages({

    "string.min": "Sub Title must be at least 3 characters long",


  }), // Truly optional field
  description: Joi.string().required().messages({
    "string.empty": "Description is required",
    "any.required": "Description is required",
  }),
  placeOfEvent: Joi.string().allow(null, "").optional(), // Also made consistent
  state: Joi.string().required().messages({
    "string.empty": "State is required",
    "any.required": "State is required",
  }),
  noOfParticipant: Joi.number().required().messages({
    "string.empty": "Number of participant is required",
    "any.required": "Number of participant is required",
  }),
  realParticipant: Joi.number().required().messages({
    "string.empty": "Number Real of participant is required",
    "any.required": "Number Real of participant is required",
  }),
  date: Joi.date().iso().required().messages({
    "date.base": "Date of Event must be a valid date",
    "date.format": "Date of Event must be in YYYY-MM-DD format",
    "any.required": "Date of Event is required",
  }),
  photos: Joi.string().allow(null, ""),
  attendance: Joi.string().allow(null, ""),
  attendantPhoto: Joi.string().allow(null, ""),
  visiblity: Joi.string().required().messages({
    "string.empty": "Visiblity is required",
    "any.required": "Visiblity is required",
  }),
});

const validateEvent = (req, res, next) => {
  const { error } = validateEventSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const messages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: messages,
    });
  }

  next();
};

const validateUpdateEventSchema = Joi.object({
  // Personal Info
  title: Joi.string().min(3).max(50).required().messages({
    "string.base": "Title must be a string",
    "string.empty": "Title is required",
    "string.min": "Title must be at least 3 characters long",
    "string.max": "Title must be at most 50 characters long",
    "any.required": "Title is required",
  }),

  subTitle: Joi.string().min(3).max(100).allow(null, "").optional().messages({
    "string.min": "Sub Title must be at least 3 characters long",
    "string.max": "Sub Title must be at most 100 characters long",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Description is required",
    "any.required": "Description is required",
  }),
  placeOfEvent: Joi.string().allow(null, "").optional(), // Also made consistent
  state: Joi.string().required().messages({
    "string.empty": "State is required",
    "any.required": "State is required",
  }),
  noOfParticipant: Joi.number().required().messages({
    "string.empty": "Number of participant is required",
    "any.required": "Number of participant is required",
  }),
  realParticipant: Joi.number().required().messages({
    "string.empty": "Number Real of participant is required",
    "any.required": "Number Real of participant is required",
  }),

  date: Joi.date().iso().required().messages({
    "date.base": "Date of Event must be a valid date",
    "date.format": "Date of Event must be in YYYY-MM-DD format",
    "any.required": "Date of Event is required",
  }),
  visiblity: Joi.string().required().messages({
    "string.empty": "Visiblity is required",
    "any.required": "Visiblity is required",
  }),
});

const validateUpdateEvent = (req, res, next) => {
  const { error } = validateUpdateEventSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const messages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: messages,
    });
  }

  next();
};

const validateQRFormSchema = Joi.object({
  fullName: Joi.string().required().messages({
    "string.empty": "Name field is required",
    "any.required": "Name field is required",
  }),
  sector: Joi.string().required().messages({
    "string.empty": "Sector is required",
    "any.required": "Sector is required",
  }),
  rate: Joi.string().required().messages({
    "string.empty": "Sector is required",
    "any.required": "Sector is required",
  }),
  gender: Joi.string().valid("Male", "Female", "Other").required().messages({
    "string.empty": "Gender is required",
    "any.only": "Gender must be Male, Female, or Other",
    "any.required": "Gender is required",
  }),
  deviceAddress: Joi.string().required().messages({
    "string.empty": "Device address is required",
    "any.required": "Device address is required",
  }),
  deviceLocation: Joi.object().unknown(true).required().messages({
    "object.base": "Device location must be a valid JSON object",
    "any.required": "Device location is required",
  }),
  event_id: Joi.number().required().messages({
    "number.base": "Event ID must be a number",
    "any.required": "Event ID is required",
  }),
});

const validateQRFrom = (req, res, next) => {
  const { error } = validateQRFormSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const messages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: messages,
    });
  }

  next();
};

const validateListSchema = Joi.object({
  type: Joi.string().min(2).max(50).required().messages({
    "string.base": "Type must be a string",
    "string.empty": "Type is required",
    "string.min": "Type must be at least 2 characters long",
    "string.max": "Type must be at most 50 characters long",
    "any.required": "Type is required",
  }),

  columns: Joi.array()
    .items(Joi.string().min(1).max(100).required())
    .min(1)
    .required()
    .messages({
      "array.base": "Columns must be an array",
      "array.min": "At least one column is required",
      "any.required": "Columns field is required",
      "string.base": "Each column must be a string",
      "string.empty": "Column value cannot be empty",
    }),
});

const validateList = (req, res, next) => {
  const { error } = validateListSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const messages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: messages,
    });
  }

  next();
};


module.exports = {
  validateProfile,
  validateWork,
  validatePersonalInfo,
  validateEvent,
  validateQRFrom,
  validateUpdateEvent,
  validateUpdateWork,
  validateList,
};
