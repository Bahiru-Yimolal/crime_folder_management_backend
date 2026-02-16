const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // These values should be passed in req.body or gathered from context
        // For now, we expect them in req.body or we'll have to fetch them in the service
        // However, multer runs BEFORE the controller. 
        // We might need to use a flexible destination and relocate files, 
        // or ensure essential path info is in the query/body.

        // Default base path
        const baseDir = path.join(__dirname, "../../uploads/documents");

        // We'll use a temporary folder and move them in the service once we have all IDs/Names 
        // OR we ask the user to provide necessary path params in the request.
        const tempDir = path.join(baseDir, "temp");

        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        cb(null, tempDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|svg|gif|pdf|doc|docx|mp4|mp3|wav|mkv|m4a/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error("Only images, PDFs, audio, and video files are allowed!"));
        }
    },
});

module.exports = upload;
