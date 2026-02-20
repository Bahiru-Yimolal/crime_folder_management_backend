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

    async getFolderById(req, res, next) {
        try {
            const { id } = req.params;
            const unitId = req.user.unit.id;

            const folder = await folderService.getFolderById(id, unitId);

            res.status(200).json({
                status: "success",
                data: folder
            });
        } catch (error) {
            next(error);
        }
    }

    async searchFolders(req, res, next) {
        try {
            const unitId = req.user.unit.id;
            const { column, value, page = 1, limit = 10 } = req.query;

            if (!column || !value) {
                throw new AppError("Search column and value are required", 400);
            }

            const result = await folderService.searchFolders(unitId, column, value, page, limit);

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

    async softDeleteFolder(req, res, next) {
        try {
            const { id } = req.params;
            const unitId = req.user.unit.id;

            await folderService.softDeleteFolder(id, unitId);

            res.status(200).json({
                status: "success",
                message: "Crime folder soft deleted successfully"
            });
        } catch (error) {
            next(error);
        }
    }

    async addFolderDocuments(req, res, next) {
        try {
            const { id } = req.params;
            const unitId = req.user.unit.id;
            const { fieldName } = req.body;

            if (!fieldName) {
                throw new AppError("fieldName is required (gallery, video, audio, or documents)", 400);
            }

            if (!req.files || req.files.length === 0) {
                throw new AppError("No files uploaded", 400);
            }

            const result = await folderService.addFolderDocuments(id, unitId, fieldName, req.files, req.user.id);

            res.status(200).json({
                status: "success",
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new FolderController();
