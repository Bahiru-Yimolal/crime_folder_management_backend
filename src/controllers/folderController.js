const folderService = require("../services/folderService");

class FolderController {
    async createFolder(req, res, next) {
        try {
            // Take administrative_unit_id from the token
            req.body.administrative_unit_id = req.user.unit.id;

            // console.log(req.body);
            // console.log(req.files); 

            const folder = await folderService.createFolder(req.body, req.files, req.user.id);

            res.status(201).json({
                status: "success",
                message: "Crime folder created successfully",
                data: folder,
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllFolders(req, res, next) {
        try {
            const unitId = req.user.unit.id;
            const { page = 1, limit = 10 } = req.query;

            const result = await folderService.getAllFolders(unitId, page, limit);

            res.status(200).json({
                status: "success",
                data: result.folders,
                pagination: {
                    totalItems: result.totalItems,
                    totalPages: result.totalPages,
                    currentPage: result.currentPage,
                    limit: parseInt(limit)
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async getMyFolders(req, res, next) {
        try {
            const userId = req.user.id;
            const unitId = req.user.unit.id;
            const { page = 1, limit = 10 } = req.query;

            const result = await folderService.getMyFolders(userId, unitId, page, limit);

            res.status(200).json({
                status: "success",
                data: result.folders,
                pagination: {
                    totalItems: result.totalItems,
                    totalPages: result.totalPages,
                    currentPage: result.currentPage,
                    limit: parseInt(limit)
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new FolderController();
