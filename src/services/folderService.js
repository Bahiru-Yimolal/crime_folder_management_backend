const { CrimeFolders, Persons, Documents, AdministrativeUnit, User } = require("../models");
const path = require("path");
const fs = require("fs");
const sequelize = require("../config/database");
const { AppError } = require("../middlewares/errorMiddleware");

class FolderService {
    async createFolder(data, files, userId) {
        // 0. Check for duplicate inspection_number
        const existingFolder = await CrimeFolders.findOne({
            where: { inspection_number: data.inspection_number }
        });

        if (existingFolder) {
            throw new AppError(`Inspection number '${data.inspection_number}' already exists`, 400);
        }

        const transaction = await sequelize.transaction();
        try {
            const {
                inspection_number,
                administrative_unit_id,
                crime_category,
                inspection_location_place,
                justice_location_place,
                inspector_name,
                lawyer_name,
                appointment_date,
                folder_creation_day,
                decision,
                accusers,
                accused_persons,
            } = data;

            // 1. Create the Crime Folder
            const folder = await CrimeFolders.create(
                {
                    inspection_number,
                    administrative_unit_id,
                    crime_category,
                    inspection_location_place,
                    justice_location_place,
                    inspector_name,
                    lawyer_name,
                    appointment_date,
                    folder_creation_day,
                    decision,
                    created_by: userId,
                },
                { transaction }
            );

            // 2. Handle Persons (Accusers and Accused)
            await this._handlePersons(folder.id, accusers, "accuser", transaction);
            await this._handlePersons(folder.id, accused_persons, "accused", transaction);

            // 3. Handle Files
            if (files && files.length > 0) {
                await this._handleFiles(folder, files, userId, transaction);
            }

            await transaction.commit();
            return folder;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async getAllFolders(unitId, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const { count, rows } = await CrimeFolders.findAndCountAll({
                where: { administrative_unit_id: unitId },
                include: [
                    {
                        model: Persons,
                        attributes: ["id", "full_name", "national_id", "phone_number", "role"],
                    },
                    {
                        model: Documents,
                        attributes: ["id", "file_name", "file_type", "file_path", "file_size"],
                    }
                ],
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [["createdAt", "DESC"]]
            });

            return {
                totalItems: count,
                folders: rows,
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page),
            };
        } catch (error) {
            throw error;
        }
    }

    async getMyFolders(userId, unitId, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const { count, rows } = await CrimeFolders.findAndCountAll({
                where: {
                    created_by: userId,
                    administrative_unit_id: unitId
                },
                include: [
                    {
                        model: Persons,
                        attributes: ["id", "full_name", "national_id", "phone_number", "role"],
                    },
                    {
                        model: Documents,
                        attributes: ["id", "file_name", "file_type", "file_path", "file_size"],
                    }
                ],
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [["createdAt", "DESC"]]
            });

            return {
                totalItems: count,
                folders: rows,
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page),
            };
        } catch (error) {
            throw error;
        }
    }

    async _handlePersons(crimeId, persons, role, transaction) {
        for (const personData of persons) {
            // Persons table now includes crime_id and role directly
            await Persons.create({
                full_name: personData.full_name,
                national_id: personData.national_id,
                phone_number: personData.phone_number,
                crime_id: crimeId,
                role: role,
            }, { transaction });
        }
    }

    async _handleFiles(folder, files, userId, transaction) {
        const unit = await AdministrativeUnit.findByPk(folder.administrative_unit_id);

        // Year from folder_creation_day or current date
        const creationDate = folder.folder_creation_day ? new Date(folder.folder_creation_day) : new Date();
        const year = creationDate.getFullYear().toString();

        // Map subcategory to top-level folder
        const categoryMapping = {
            vehicle_vehicle: "traffic",
            vehicle_property: "traffic",
            vehicle_people: "traffic",
            women_children: "crime",
            normal: "crime"
        };
        const topCategory = categoryMapping[folder.crime_category] || "other";
        const subCategory = folder.crime_category;

        const unitName = unit.name.toLowerCase().replace(/\s+/g, '_');
        const folderName = `crime_${folder.id}`;

        // Structured path: uploads/YEAR/TOP_CAT/SUB_CAT/UNIT_NAME/crime_ID
        // relativePath should NOT include 'uploads' because BASE_FILE_URL already has it
        const relativePath = path.join(year, topCategory, subCategory, unitName, folderName);
        const absolutePath = path.join(__dirname, "../../uploads", relativePath);

        if (!fs.existsSync(absolutePath)) {
            fs.mkdirSync(absolutePath, { recursive: true });
        }

        for (const file of files) {
            const finalDest = path.join(absolutePath, file.filename);
            fs.renameSync(file.path, finalDest);

            await Documents.create({
                crime_id: folder.id,
                administrative_unit_id: folder.administrative_unit_id,
                file_name: file.originalname,
                file_type: this._getFileType(file.mimetype),
                file_path: path.join(relativePath, file.filename),
                file_size: file.size,
                uploaded_by: userId,
            }, { transaction });
        }
    }

    _getFileType(mimetype) {
        if (mimetype.startsWith("image/")) return 1; // Photo
        if (mimetype.startsWith("video/")) return 2; // Video
        if (mimetype.startsWith("audio/")) return 3; // Audio
        if (mimetype === "application/pdf") return 4; // PDF
        return 5; // Other
    }
}

module.exports = new FolderService();
