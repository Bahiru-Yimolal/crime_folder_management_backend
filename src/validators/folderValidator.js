const Joi = require("joi");
const fs = require("fs");

const folderSchema = Joi.object({
    inspection_number: Joi.string().required(),
    crime_category: Joi.string().valid(
        "vehicle_vehicle",
        "vehicle_property",
        "vehicle_people",
        "women_children",
        "normal"
    ).required(),
    inspection_location_place: Joi.string().optional().allow(null, ""),
    justice_location_place: Joi.string().optional().allow(null, ""),
    inspector_name: Joi.string().optional().allow(null, ""),
    lawyer_name: Joi.string().optional().allow(null, ""),
    appointment_dates: Joi.array().items(Joi.date()).optional().default([]),
    folder_creation_day: Joi.date().optional().allow(null, ""),
    decision: Joi.string().optional().allow(null, ""),
    accusers: Joi.array().items(
        Joi.object({
            full_name: Joi.string().required(),
            national_id: Joi.string().allow(null, ""),
            phone_number: Joi.string().allow(null, ""),
        })
    ).min(1).required(),
    accused_persons: Joi.array().items(
        Joi.object({
            full_name: Joi.string().required(),
            national_id: Joi.string().allow(null, ""),
            phone_number: Joi.string().allow(null, ""),
        })
    ).min(1).required(),
    administrative_unit_id: Joi.string().optional(),
    // Allow file fields in body if they are sent as empty strings/placeholders by Swagger
    documents: Joi.any().optional(),
    gallery: Joi.any().optional(),
    audio: Joi.any().optional(),
    video: Joi.any().optional(),
});

const cleanupFiles = (files) => {
    if (!files) return;

    // If files is an object (upload.fields)
    if (typeof files === "object" && !Array.isArray(files)) {
        Object.values(files).forEach(fileArray => {
            if (Array.isArray(fileArray)) {
                fileArray.forEach(file => {
                    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
                });
            }
        });
    }
    // If files is an array (upload.array)
    else if (Array.isArray(files)) {
        files.forEach(file => {
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
    }
};

const validateFolder = (req, res, next) => {
    // Parse JSON strings for accusers/accused_persons if they come from multipart/form-data
    // Parse JSON strings for accusers/accused_persons/appointment_dates if they come from multipart/form-data
    try {
        const parseParsedField = (field) => {
            if (req.body[field] === "" || req.body[field] === undefined || req.body[field] === "undefined") {
                if (field === "appointment_dates") {
                    req.body[field] = [];
                } else if (field === "accusers" || field === "accused_persons") {
                    // Keep as is for Joi to catch missing required fields
                } else {
                    delete req.body[field];
                }
                return;
            }

            if (typeof req.body[field] === "string") {
                const trimmed = req.body[field].trim();
                if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
                    req.body[field] = JSON.parse(trimmed);
                } else if (field === "appointment_dates" && trimmed !== "") {
                    req.body.appointment_dates = [trimmed];
                }
            }
        };

        parseParsedField("accusers");
        parseParsedField("accused_persons");
        parseParsedField("appointment_dates");
    } catch (e) {
        cleanupFiles(req.files);
        return res.status(400).json({
            success: false,
            message: "Invalid format in accusers, accused_persons, or appointment_dates. Expected JSON array or plural fields."
        });
    }

    const { error } = folderSchema.validate(req.body, { abortEarly: false });
    if (error) {
        cleanupFiles(req.files);
        const errorMessage = error.details.map(detail => detail.message).join(", ");
        return res.status(400).json({ success: false, message: errorMessage });
    }

    // Check for duplicate national_id across both accusers and accused
    const allParticipants = [...(req.body.accusers || []), ...(req.body.accused_persons || [])];
    const nationalIds = allParticipants
        .map(p => p.national_id)
        .filter(id => id && id.trim() !== "");

    const duplicateId = nationalIds.find((id, index) => nationalIds.indexOf(id) !== index);
    if (duplicateId) {
        cleanupFiles(req.files);
        return res.status(400).json({
            success: false,
            message: `Duplicate national_id found in participants: ${duplicateId}. Each person can only appear once in a folder.`
        });
    }

    next();
};

module.exports = { validateFolder };
