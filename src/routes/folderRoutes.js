const express = require("express");
const router = express.Router();
const folderController = require("../controllers/folderController");
const { validateFolder } = require("../validators/folderValidator");
const upload = require("../config/uploadConfig");
const { protect, assignmentMiddleware, levelGuard, permissionMiddleware } = require("../middlewares/authMiddleware");

// Use protect and assignmentMiddleware to get req.user
router.post(
    "/",
    protect,
    assignmentMiddleware,
    permissionMiddleware("CREATE_FOLDER"),
    upload.fields([
        { name: "documents", maxCount: 10 },
        { name: "gallery", maxCount: 20 },
        { name: "audio", maxCount: 10 },
        { name: "video", maxCount: 5 }
    ]),
    validateFolder,
    folderController.createFolder
);
router.get("/", protect, assignmentMiddleware, permissionMiddleware("READ_FOLDER"), folderController.getAllFolders);
router.get(
    "/my-folders",
    protect,
    assignmentMiddleware,
    permissionMiddleware("READ_FOLDER"),
    folderController.getMyFolders
);

router.get(
    "/:id",
    protect,
    assignmentMiddleware,
    permissionMiddleware("READ_FOLDER"),
    folderController.getFolderById
);

module.exports = router;
