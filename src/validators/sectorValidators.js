const Joi = require("joi");

// Define the group validation schema
const sectorSchema = Joi.object({
  sector_name: Joi.string().required().messages({
    "string.empty": "Sector name is required",
    "any.required": "Sector name is required",
  }),
  sector_leader_id: Joi.number().integer().optional().allow(null).messages({
    "number.base": "Sector leader ID must be a number.",
    "number.integer": "Sector leader ID must be an integer.",
  }),
});

// Middleware for validating group input
const validateSectorInput = (req, res, next) => {
  const { error } = sectorSchema.validate(req.body);

  if (error) {
    // If validation fails, send an error response
    return res.status(400).json({ error: error.details[0].message });
  }

  // If validation passes, proceed to the next middleware
  next();
};

const CommitteSchema = Joi.object({
  committee_name: Joi.string().required().messages({
    "string.empty": "School name is required",
    "any.required": "School name is required",
  }),
  committee_leader_id: Joi.number().integer().optional().allow(null).messages({
    "number.base": "School leader ID must be a number.",
    "number.integer": "School leader ID must be an integer.",
  }),
  sector_id: Joi.number().integer().optional().allow(null).messages({
    "number.base": "Sector ID must be a number.",
    "number.integer": "Sector ID must be an integer.",
  }),
    school_address: Joi.string().required().messages({
    "string.empty": "School Address is required",
    "any.required": "School Address is required",
  }),
    school_type: Joi.string().required().messages({
    "string.empty": "School type is required",
    "any.required": "School type is required",
  }),
    school_location: Joi.object().required().messages({
      "object.base": "School locaiton info must be an object",
  }),
});
const validateCommitteInput = (req, res, next) => {
  const { error } = CommitteSchema.validate(req.body);

  if (error) {
    // If validation fails, send an error response
    return res.status(400).json({ error: error.details[0].message });
  }

  // If validation passes, proceed to the next middleware
  next();
};

// // Define the validation schema for reassigning group leader
const assignSectorLeaderSchema = Joi.object({
  sector_id: Joi.number().integer().required().messages({
    "number.base": "Sector ID must be a number.",
    "any.required": "Sector ID is required.",
  }),
  new_sector_leader_id: Joi.number().integer().required().messages({
    "number.base": "New Sector Leader ID must be a number.",
    "any.required": "New Sector Leader ID is required.",
  }),
});

// // Middleware to validate reassigning group leader data
const validateAssignSectorLeader = (req, res, next) => {
  const { error } = assignSectorLeaderSchema.validate(req.body);
  if (error) {
    // Map the technical Joi error message to a user-friendly one
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  next(); // Proceed if validation succeeds
};

const validateSectorName = (req, res, next) => {
  const schema = Joi.object({
    sector_name: Joi.string().min(3).max(100).required().messages({
      "string.empty": "Sector name is required.",
      "string.min": "Sector name must be at least 3 characters long.",
      "string.max": "Sector name must be less than or equal to 100 characters.",
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

const assignCommitteeSchema = Joi.object({
  committee_id: Joi.number().integer().required().messages({
    "number.base": "Committee ID must be a number.",
    "any.required": "Committee ID is required.",
  }),
  new_committee_leader_id: Joi.number().integer().required().messages({
    "number.base": "New Committee ID must be a number.",
    "any.required": "New Committee ID is required.",
  }),
});

// // Middleware to validate reassigning group leader data
const validateAssignCommittee = (req, res, next) => {
  const { error } = assignCommitteeSchema.validate(req.body);
  if (error) {
    // Map the technical Joi error message to a user-friendly one
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  next(); // Proceed if validation succeeds
};

const validateCommitteeName = (req, res, next) => {
  const schema = Joi.object({
    committee_name: Joi.string().min(3).max(100).required().messages({
      "string.empty": "Committee name is required.",
      "string.min": "Committee name must be at least 3 characters long.",
      "string.max": "Committee name must be less than or equal to 100 characters.",
    }),
  });

}

const CommitteUpdateSchema = Joi.object({
  committee_name: Joi.string().optional().messages({
    "string.empty": "School name is required",
    "any.required": "School name is required",
  }),
  committee_leader_id: Joi.number().integer().optional().allow(null).messages({
    "number.base": "School leader ID must be a number.",
    "number.integer": "School leader ID must be an integer.",
  }),
  sector_id: Joi.number().integer().optional().allow(null).messages({
    "number.base": "Sector ID must be a number.",
    "number.integer": "Sector ID must be an integer.",
  }),
    school_address: Joi.string().optional().messages({
    "string.empty": "School Address is required",
    "any.required": "School Address is required",
  }),
    school_type: Joi.string().optional().messages({
    "string.empty": "School type is required",
    "any.required": "School type is required",
  }),
    school_location: Joi.object().optional().messages({
    "object.base": "School location info must be an object",
  }),
});
const validateUpdateCommitteInput = (req, res, next) => {
  const { error } = CommitteUpdateSchema.validate(req.body);

  if (error) {
    // If validation fails, send an error response
    return res.status(400).json({ error: error.details[0].message });
  }

  // If validation passes, proceed to the next middleware
  next();
};


const AttendanceSchema = Joi.object({
  user_id: Joi.number().integer().required().messages({
    "number.base": "User ID must be a number",
    "any.required": "User ID is required",
  }),

  committee_id: Joi.number().integer().required().messages({
    "number.base": "Committee ID must be a number",
    "any.required": "Committee ID is required",
  }),

  check_in_time: Joi.date().optional().messages({
    "date.base": "Check-in time must be a valid date",
  }),

  check_out_time: Joi.date().optional().messages({
    "date.base": "Check-out time must be a valid date",
  }),

  comments: Joi.string().optional().allow(null, "").messages({
    "string.base": "Comments must be a string",
  }),

  device_info: Joi.object().optional().allow(null).messages({
    "object.base": "Device info must be an object",
  }),

  location: Joi.object().optional().allow(null, "").messages({
    "object.base": "location info must be an object",
  }),
});

const validateAttendanceInput = (req, res, next) => {
  const { error } = AttendanceSchema.validate(req.body, { abortEarly: true });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateAssignSectorLeader,
  validateSectorName,
  validateSectorInput,
  validateCommitteInput,
  validateAssignCommittee,
  validateCommitteeName,
  validateUpdateCommitteInput,
  validateAttendanceInput
};
