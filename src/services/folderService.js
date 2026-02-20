const { CrimeFolders, Persons, Documents, AdministrativeUnit, User } = require("../models");
const path = require("path");
const fs = require("fs");
const sequelize = require("../config/database");
const { Op } = require("sequelize");
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
                appointment_dates,
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
                    appointment_dates,
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
            if (files && Object.keys(files).length > 0) {
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

    async getFolderById(id, unitId) {
        const folder = await CrimeFolders.findOne({
            where: {
                id: id,
                administrative_unit_id: unitId
            },
            include: [
                { model: Persons },
                { model: Documents }
            ]
        });

        if (!folder) {
            throw new AppError("Crime folder not found", 404);
        }

        return folder;
    }

    async searchFolders(unitId, column, value, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const folderColumns = ["inspection_number", "crime_category", "inspection_location_place", "justice_location_place", "inspector_name", "lawyer_name", "decision"];
            const personColumns = ["full_name", "national_id", "phone_number", "role"];

            let whereClause = { administrative_unit_id: unitId };
            let personWhereClause = {};

            if (folderColumns.includes(column)) {
                whereClause[column] = { [Op.iLike]: `%${value}%` };
            } else if (personColumns.includes(column)) {
                personWhereClause[column] = { [Op.iLike]: `%${value}%` };
            } else {
                throw new AppError(`Invalid search column: ${column}`, 400);
            }

            const { count, rows } = await CrimeFolders.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: Persons,
                        where: Object.keys(personWhereClause).length > 0 ? personWhereClause : undefined,
                        required: Object.keys(personWhereClause).length > 0, // Inner join if searching by person
                        attributes: ["id", "full_name", "national_id", "phone_number", "role"],
                    },
                    {
                        model: Documents,
                        attributes: ["id", "file_name", "file_type", "file_path", "file_size"],
                    }
                ],
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [["createdAt", "DESC"]],
                distinct: true // Important when using includes with limit/offset
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

    async softDeleteFolder(id, unitId) {
        const folder = await CrimeFolders.findOne({
            where: {
                id: id,
                administrative_unit_id: unitId
            }
        });

        if (!folder) {
            throw new AppError("Crime folder not found", 404);
        }

        await folder.destroy();
        return true;
    }

    async addFolderDocuments(id, unitId, fieldName, files, userId) {
        const folder = await CrimeFolders.findOne({
            where: {
                id: id,
                administrative_unit_id: unitId
            }
        });

        if (!folder) {
            throw new AppError("Crime folder not found", 404);
        }

        const transaction = await sequelize.transaction();
        try {
            // Re-use _handleFiles logic by wrapping the field
            const fields = { [fieldName]: files };
            await this._handleFiles(folder, fields, userId, transaction);

            await transaction.commit();
            return { message: "Documents added successfully" };
        } catch (error) {
            await transaction.rollback();
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

    async _handleFiles(folder, fields, userId, transaction) {
        // Fetch Administrative Unit name for the path
        const unit = await AdministrativeUnit.findByPk(folder.administrative_unit_id);
        const unitSlug = unit ? `${unit.level.toLowerCase()}_${unit.name.toLowerCase().replace(/\s+/g, '_')}` : "unknown_unit";

        // Year from folder_creation_day or current date
        const creationDate = folder.folder_creation_day ? new Date(folder.folder_creation_day) : new Date();
        const year = creationDate.getFullYear().toString();
        const folderName = `crime_${folder.id}`;

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

        try {
            // Iterate through each field (documents, gallery, audio, video)
            for (const [fieldName, files] of Object.entries(fields)) {
                if (!files || files.length === 0) continue;

                // Path Structure: YEAR/TOP_CAT/SUB_CAT/UNIT_NAME/crime_ID/FIELD_NAME/
                const fieldPath = path.join(year, topCategory, subCategory, unitSlug, folderName, fieldName);
                const absoluteFieldPath = path.join(__dirname, "../../uploads", fieldPath);

                if (!fs.existsSync(absoluteFieldPath)) {
                    fs.mkdirSync(absoluteFieldPath, { recursive: true });
                }

                for (const file of files) {
                    const finalDest = path.join(absoluteFieldPath, file.filename);

                    // Move file from temp to final destination
                    if (fs.existsSync(file.path)) {
                        fs.renameSync(file.path, finalDest);
                    }

                    await Documents.create({
                        crime_id: folder.id,
                        administrative_unit_id: folder.administrative_unit_id,
                        file_name: file.originalname,
                        file_type: this._getFileTypeByField(fieldName, file.mimetype),
                        file_path: path.join(fieldPath, file.filename),
                        file_size: file.size,
                        uploaded_by: userId,
                    }, { transaction });
                }
            }
        } catch (error) {
            // Cleanup temp files if something fails during move or DB creation
            this._cleanupFields(fields);
            throw error;
        }
    }

    _getFileTypeByField(fieldName, mimetype) {
        // Map fields to file_type IDs: 1=Photo (gallery), 2=Video, 3=Audio, 4=PDF (documents), 5=Other
        if (fieldName === "gallery") return 1;
        if (fieldName === "video") return 2;
        if (fieldName === "audio") return 3;
        if (fieldName === "documents") return 4;
        return 5;
    }

    _cleanupFields(fields) {
        if (!fields) return;
        Object.values(fields).forEach(fileArray => {
            if (Array.isArray(fileArray)) {
                fileArray.forEach(file => {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                });
            }
        });
    }
}

module.exports = new FolderService();
