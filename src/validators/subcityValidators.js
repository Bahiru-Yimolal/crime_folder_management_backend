const Joi = require("joi");

// Define the subcity validation schema
const subcitySchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "Subcity name is required",
        "any.required": "Subcity name is required",
    }),
});

// Define assign subcity admin validation schema
const assignSubcityAdminSchema = Joi.object({
    userId: Joi.string()
        .uuid()
        .required()
        .messages({
            "string.empty": "User ID is required",
            "any.required": "User ID is required",
            "string.guid": "User ID must be a valid UUID",
        }),

    subcityId: Joi.string()
        .uuid()
        .required()
        .messages({
            "string.empty": "Subcity ID is required",
            "any.required": "Subcity ID is required",
            "string.guid": "Subcity ID must be a valid UUID",
        }),

    permissions: Joi.array()
        .items(Joi.string())
        .optional()
        .messages({
            "array.base": "Permissions must be an array of strings",
        }),
});

// Middleware for validating subcity input
const validateSubcityInput = (req, res, next) => {
    const { error } = subcitySchema.validate(req.body);

    if (error) {
        // If validation fails, send an error response
        return res.status(400).json({ error: error.details[0].message });
    }

    // If validation passes, proceed to the next middleware
    next();
};

// Middleware for validating assign subcity admin input
const validateAssignSubcityAdminInput = (req, res, next) => {
    const { error } = assignSubcityAdminSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
        });
    }

    next();
};

// Define create subcity user schema
const createSubcityUserSchema = Joi.object({
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

// Middleware for validating create subcity user input
const validateCreateCityUserInput = (req, res, next) => {
    const { error } = createSubcityUserSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
        });
    }

    next();
};

module.exports = {
    validateSubcityInput,
    validateAssignSubcityAdminInput,
    validateCreateCityUserInput,
};
