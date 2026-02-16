/**
 * @swagger
 * tags:
 *   name: Folders
 *   description: Crime folder management
 */

/**
 * @swagger
 * /folders:
 *   post:
 *     summary: Create a new crime folder
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - inspection_number
 *               - crime_category
 *               - accusers
 *               - accused_persons
 *             properties:
 *               inspection_number:
 *                 type: string
 *                 example: "CR-2025-10001"
 *               crime_category:
 *                 type: string
 *                 description: "Allowed values: vehicle_vehicle, vehicle_property, vehicle_people, women_children, normal"
 *                 example: "vehicle_vehicle"
 *               inspection_location_place:
 *                 type: string
 *                 example: "Addis Ababa, Bole"
 *               justice_location_place:
 *                 type: string
 *                 example: "Federal Court"
 *               inspector_name:
 *                 type: string
 *                 example: "Inspector Gadget"
 *               lawyer_name:
 *                 type: string
 *                 example: "Harvey Specter"
  *               appointment_dates:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: date
 *                 example: ["2025-03-15", "2025-03-22"]
 *               folder_creation_day:
 *                 type: string
 *                 format: date
 *                 example: "2025-03-01"
 *               decision:
 *                 type: string
 *                 example: "Pending investigation"
 *               accusers:
 *                 type: string
 *                 description: JSON string array of person objects
 *                 example: '[{"full_name": "John Doe", "national_id": "ID12345", "phone_number": "0912345678"}, {"full_name": "Jane Smith", "national_id": "ID67890", "phone_number": "0987654321"}]'
 *               accused_persons:
 *                 type: string
 *                 description: JSON string array of person objects
 *                 example: '[{"full_name": "Moriarty", "national_id": "ID999", "phone_number": "0900000000"}]'
 *               documents:
 *                 type: array
 *                 description: General documents
 *                 items:
 *                   type: string
 *                   format: binary
 *               gallery:
 *                 type: array
 *                 description: Photos and images
 *                 items:
 *                   type: string
 *                   format: binary
 *               audio:
 *                 type: array
 *                 description: Voice recordings
 *                 items:
 *                   type: string
 *                   format: binary
 *               video:
 *                 type: array
 *                 description: Video footages
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Crime folder created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Crime folder created successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *
 *   get:
 *     summary: Get all crime folders for the current administrative unit (Paginated)
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of crime folders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *
 * /folders/my-folders:
 *   get:
 *     summary: Get crime folders created by the current user (Paginated)
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Paginated list of user's crime folders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
