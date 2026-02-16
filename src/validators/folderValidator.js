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
    appointment_date: Joi.date().optional().allow(null, ""),
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
});

const cleanupFiles = (files) => {
    if (files && Array.isArray(files)) {
        files.forEach(file => {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        });
    }
};

const validateFolder = (req, res, next) => {
    // Parse JSON strings for accusers/accused_persons if they come from multipart/form-data
    try {
        if (typeof req.body.accusers === "string") {
            req.body.accusers = JSON.parse(req.body.accusers);
        }
        if (typeof req.body.accused_persons === "string") {
            req.body.accused_persons = JSON.parse(req.body.accused_persons);
        }
    } catch (e) {
        cleanupFiles(req.files);
        return res.status(400).json({ success: false, message: "Invalid JSON format in accusers or accused_persons arrays" });
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
