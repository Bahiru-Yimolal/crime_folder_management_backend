/**
 * @swagger
 * /cities:
 *   post:
 *     summary: Create a new City (Ethiopia-level only)
 *     tags: [Super Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Addis Ababa"
 *                 description: Name of the city to create
 *     responses:
 *       201:
 *         description: City created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 city:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     name:
 *                       type: string
 *                       example: "Addis Ababa"
 *                     level:
 *                       type: string
 *                       example: "CITY"
 *                     parent_id:
 *                       type: string
 *                       format: uuid
 *                       example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 *                 message:
 *                   type: string
 *                   example: "City created successfully"
 *       400:
 *         description: Invalid input or city already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "City with this name already exists"
 *       401:
 *         description: Unauthorized – token missing or invalid
 *       403:
 *         description: Forbidden – user not Ethiopia-level or lacks CREATE_CITY permission
 */

/**
 * @swagger
 * /cities:
 *   get:
 *     summary: List all cities (Ethiopia-level only)
 *     tags: [Super Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 cities:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "550e8400-e29b-41d4-a716-446655440000"
 *                       name:
 *                         type: string
 *                         example: "Addis Ababa"
 *                       level:
 *                         type: string
 *                         example: "CITY"
 *                       parent_id:
 *                         type: string
 *                         format: uuid
 *                         example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 *       401:
 *         description: Unauthorized – token missing or invalid
 *       403:
 *         description: Forbidden – user not Ethiopia-level or lacks READ permission
 */

/**
 * @swagger
 * /cities/{id}:
 *   put:
 *     summary: Update city information (Ethiopia-level only)
 *     tags: [Super Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the city to update
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "New Addis Ababa"
 *                 description: New name of the city
 *     responses:
 *       200:
 *         description: City updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 city:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     name:
 *                       type: string
 *                       example: "New Addis Ababa"
 *                     level:
 *                       type: string
 *                       example: "CITY"
 *                     parent_id:
 *                       type: string
 *                       format: uuid
 *                       example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 *                 message:
 *                   type: string
 *                   example: "City updated successfully"
 *       400:
 *         description: Invalid input or duplicate city name
 *       401:
 *         description: Unauthorized – token missing or invalid
 *       403:
 *         description: Forbidden – user not Ethiopia-level or lacks UPDATE permission
 *       404:
 *         description: City not found
 */

/**
 * @swagger
 * /cities/{id}:
 *   put:
 *     summary: Update city information (Ethiopia-level only)
 *     tags: [Super Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the city to update
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "New Addis Ababa"
 *                 description: New name of the city
 *     responses:
 *       200:
 *         description: City updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 city:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     name:
 *                       type: string
 *                       example: "New Addis Ababa"
 *                     level:
 *                       type: string
 *                       example: "CITY"
 *                     parent_id:
 *                       type: string
 *                       format: uuid
 *                       example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 *                 message:
 *                   type: string
 *                   example: "City updated successfully"
 *       400:
 *         description: Invalid input or duplicate city name
 *       401:
 *         description: Unauthorized – token missing or invalid
 *       403:
 *         description: Forbidden – user not Ethiopia-level or lacks UPDATE permission
 *       404:
 *         description: City not found
 */

/**
 * @swagger
 * /cities/{id}:
 *   delete:
 *     summary: Delete a city (only if no sub-cities exist, Ethiopia-level only)
 *     tags: [Super Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the city to delete
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: City deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "City deleted successfully"
 *       400:
 *         description: Cannot delete city with sub-cities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Cannot delete city with sub-cities. Delete sub-cities first."
 *       401:
 *         description: Unauthorized – token missing or invalid
 *       403:
 *         description: Forbidden – user not Ethiopia-level or lacks DELETE permission
 *       404:
 *         description: City not found
 */

/**
 * @swagger
 * /cities/assign/city-admin:
 *   post:
 *     summary: Assign a City Admin to a City (Ethiopia-level only)
 *     tags: [Super Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - cityId
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *                 description: ID of the user to be assigned as City Admin
 *               cityId:
 *                 type: string
 *                 format: uuid
 *                 example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 *                 description: ID of the city administrative unit
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - CREATE_FOLDER
 *                   - READ_FOLDER
 *                   - UPDATE_FOLDER
 *                   - DELETE_FOLDER
 *                   - ADMIN_PERMISSIONS
 *                 description: Optional custom permissions (defaults to ADMIN role permissions if omitted)
 *     responses:
 *       201:
 *         description: City Admin assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "City Admin assigned successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     assignment:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                           example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *                         user_id:
 *                           type: string
 *                           format: uuid
 *                         unit_id:
 *                           type: string
 *                           format: uuid
 *                         role_id:
 *                           type: string
 *                           format: uuid
 *                     role:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         name:
 *                           type: string
 *                           example: "ADMIN"
 *                     unit:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         level:
 *                           type: string
 *                           example: "CITY"
 *       400:
 *         description: Invalid input or assignment conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User already assigned. Unassign before reassigning."
 *       401:
 *         description: Unauthorized – token missing or invalid
 *       403:
 *         description: Forbidden – not Ethiopia-level or missing permission
 *       404:
 *         description: User, city, or role not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /cities/assign/users:
 *   post:
 *     summary: Assign a user to Ethiopia level (Admin / Officer / Analyst)
 *     description: >
 *       Assigns an already registered UNASSIGNED user to the Ethiopia administrative level
 *       with a specified role and optional custom permissions.
 *       Only Ethiopia-level Super Admins with MANAGE_USERS permission can perform this action.
 *     tags: [Super Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - role
 *             properties:
 *               user_id:
 *                 type: string
 *                 format: uuid
 *                 example: "ad1f3384-60f4-4c10-827a-52306633302f"
 *                 description: ID of the user to assign (must be UNASSIGNED)
 *               role:
 *                 type: string
 *                 enum: [ADMIN, OFFICER, ANALYST]
 *                 example: "ADMIN"
 *                 description: Role to assign at Ethiopia level
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - CREATE_CRIME_FOLDER
 *                   - READ_CRIME_FOLDER
 *                   - UPDATE_CRIME_FOLDER
 *                 description: >
 *                   Optional list of permission names.
 *                   If omitted, default permissions for the role will be applied.
 *     responses:
 *       200:
 *         description: User assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User assigned to Ethiopia level successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                           example: "ad1f3384-60f4-4c10-827a-52306633302f"
 *                         phone_number:
 *                           type: string
 *                           example: "+251911234567"
 *                         status:
 *                           type: string
 *                           example: "ACTIVE"
 *                     assignment:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                           example: "e3c9d3b7-11fa-4fd6-b3db-b2c3a9f01234"
 *                     role:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                           example: "8a9b7c66-1a2b-4d2f-9a33-cc55eeaa7788"
 *                         name:
 *                           type: string
 *                           example: "ADMIN"
 *                     unit:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                           example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 *                         level:
 *                           type: string
 *                           example: "ETHIOPIA"
 *       400:
 *         description: Invalid input or role
 *       401:
 *         description: Unauthorized – missing or invalid token
 *       403:
 *         description: Forbidden – insufficient permission or wrong level
 *       404:
 *         description: User not found
 *       409:
 *         description: User already assigned
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /cities/assign/users:
 *   put:
 *     summary: Update Ethiopia-level user role and permissions
 *     description: >
 *       Updates the role and permissions of a user already assigned to the Ethiopia
 *       administrative level.
 *       This endpoint allows changing the user's role (Admin / Officer / Analyst)
 *       and optionally overriding their permissions.
 *       If permissions are not provided, default permissions for the role are applied.
 *       Only Ethiopia-level Super Admins with ADMIN_PERMISSIONS can perform this action.
 *     tags: [Super Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - role
 *             properties:
 *               user_id:
 *                 type: string
 *                 format: uuid
 *                 example: "ad1f3384-60f4-4c10-827a-52306633302f"
 *                 description: ID of the user already assigned to Ethiopia level
 *               role:
 *                 type: string
 *                 enum: [ADMIN, OFFICER, ANALYST]
 *                 example: "OFFICER"
 *                 description: New role to assign at Ethiopia level
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - CREATE_CRIME_FOLDER
 *                   - READ_CRIME_FOLDER
 *                 description: >
 *                   Optional list of permission names.
 *                   If omitted, default permissions for the selected role will be applied.
 *     responses:
 *       200:
 *         description: User role and permissions updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User role and permissions updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       format: uuid
 *                       example: "ad1f3384-60f4-4c10-827a-52306633302f"
 *                     unit:
 *                       type: string
 *                       example: "ETHIOPIA"
 *                     role:
 *                       type: string
 *                       example: "OFFICER"
 *                     permissions:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example:
 *                         - CREATE_CRIME_FOLDER
 *                         - READ_CRIME_FOLDER
 *       400:
 *         description: Invalid input or role
 *       401:
 *         description: Unauthorized – missing or invalid token
 *       403:
 *         description: Forbidden – insufficient permission or wrong level
 *       404:
 *         description: User not assigned to Ethiopia level
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /cities/users/unassign:
 *   delete:
 *     summary: Unassign a user from their current unit
 *     tags: [Super Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *                 description: UUID of the user to unassign
 *     responses:
 *       200:
 *         description: User unassigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User unassigned successfully"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User ID is required"
 *       401:
 *         description: Unauthorized – token missing or invalid
 *       403:
 *         description: Forbidden – user not allowed to unassign
 *       404:
 *         description: User not assigned or not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User is not assigned"
 */

/**
 * @swagger
 * /cities/users/permissions:
 *   put:
 *     summary: Update a user's permissions
 *     tags: [Super Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *                 description: UUID of the user to update
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["CREATE_CRIME_FOLDER", "READ_CRIME_FOLDER"]
 *                 description: Optional array of permission names to assign
 *     responses:
 *       200:
 *         description: Permissions updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User permissions updated successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       format: uuid
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     role:
 *                       type: string
 *                       example: "ADMIN"
 *                     permissions:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["CREATE_CRIME_FOLDER", "READ_CRIME_FOLDER"]
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized – token missing or invalid
 *       403:
 *         description: Forbidden – user lacks MANAGE_USERS permission
 *       404:
 *         description: User not assigned
 */

/**
 * @swagger
 * /cities/permissions:
 *   get:
 *     summary: Get all system permissions
 *     description: >
 *       Retrieves the complete list of permissions available in the system.
 *       Used by admins when assigning or updating user permissions.
 *       Only users with ADMIN_PERMISSIONS can access this endpoint.
 *     tags: [Super Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of permissions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "8a9b7c66-1a2b-4d2f-9a33-cc55eeaa7788"
 *                       name:
 *                         type: string
 *                         example: "CREATE_CRIME_FOLDER"
 *                       description:
 *                         type: string
 *                         example: "Allows creating a crime folder"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized – missing or invalid token
 *       403:
 *         description: Forbidden – user lacks ADMIN_PERMISSIONS
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /cities/roles:
 *   get:
 *     summary: Get all system roles
 *     description: >
 *       Retrieves all roles available in the system.
 *       Used when assigning or updating users at different administrative levels.
 *       Only users with ADMIN_PERMISSIONS can access this endpoint.
 *     tags: [Super Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "8a9b7c66-1a2b-4d2f-9a33-cc55eeaa7788"
 *                       name:
 *                         type: string
 *                         example: "ADMIN"
 *                       description:
 *                         type: string
 *                         example: "Administrator role with full privileges"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized – missing or invalid token
 *       403:
 *         description: Forbidden – user lacks ADMIN_PERMISSIONS
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /cities/personnel:
 *   get:
 *     summary: Fetch personnel by role within the Admin's unit (derived from token)
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Role name to filter by (defaults to GROUP_LEADER if omitted)
 *     responses:
 *       200:
 *         description: List of personnel retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user_id:
 *                         type: string
 *                         format: uuid
 *                       first_name:
 *                         type: string
 *                       last_name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phone_number:
 *                         type: string
 *                       status:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /cities/services:
 *   post:
 *     summary: Create a new service (Admin only)
 *     description: >
 *       Creates a new service catalog item. 
 *       If groupLeaderId is provided, the service is automatically assigned to that personnel.
 *     tags: [Service Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - place
 *               - duration
 *               - delivery_mode
 *             properties:
 *               type:
 *                 type: string
 *                 example: "ID Card Issuance"
 *               place:
 *                 type: string
 *                 example: "Counter 1"
 *               duration:
 *                 type: integer
 *                 description: Time in minutes for the service (SLA)
 *                 example: 30
 *               quality_standard:
 *                 type: number
 *                 example: 4.5
 *               delivery_mode:
 *                 type: string
 *                 example: "In-person"
 *               preconditions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Application Form", "Birth Certificate"]
 *               paymentAmount:
 *                 type: string
 *                 example: "150 Birr"
 *               completion_metric:
 *                 type: string
 *                 enum: [OFFICER, CITIZEN, BOTH_AVERAGE]
 *                 example: "OFFICER"
 *               groupLeaderIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: Optional IDs of Group Leaders to assign
 *     responses:
 *       201:
 *         description: Service created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Service created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     service:
 *                       type: object
 *                     assignments:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: Invalid input or invalid Group Leader
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /cities/services/{id}:
 *   put:
 *     summary: Update an existing service (Admin only)
 *     description: >
 *       Updates a service catalog item. 
 *       If groupLeaderIds is provided, the assignments are synchronized (replaced).
 *     tags: [Service Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the service to update
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: "Registration Card"
 *               place:
 *                 type: string
 *                 example: "Room 101"
 *               duration:
 *                 type: integer
 *                 description: Time in minutes for the service (SLA)
 *                 example: 45
 *               quality_standard:
 *                 type: number
 *                 example: 4.8
 *               delivery_mode:
 *                 type: string
 *                 example: "Online"
 *               preconditions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Application Form"]
 *               paymentAmount:
 *                 type: string
 *                 example: "200 Birr"
 *               completion_metric:
 *                 type: string
 *                 enum: [OFFICER, CITIZEN, BOTH_AVERAGE]
 *                 example: "BOTH_AVERAGE"
 *               groupLeaderIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: Array of Group Leader IDs to assign
 *     responses:
 *       200:
 *         description: Service updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Service updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     service:
 *                       type: object
 *                     assignments:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: Invalid input or invalid Group Leader
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Service not found
 */

/**
 * @swagger
 * /cities/services:
 *   get:
 *     summary: List all services in the Admin's sector (Admin only)
 *     description: >
 *       Retrieves all service catalog items created within the authenticated Admin's administrative unit.
 *       Includes details about the current Group Leader assignments.
 *     tags: [Service Management]
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
 *         description: Paginated list of services retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     services:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           type:
 *                             type: string
 *                           place:
 *                             type: string
 *                           duration:
 *                             type: integer
 *                           delivery_mode:
 *                             type: string
 *                           ServiceAssignments:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 User:
 *                                   type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /cities/services/{id}:
 *   delete:
 *     summary: Delete a service (Admin only)
 *     description: >
 *       Deletes a service catalog item and its assignments.
 *       The service can only be deleted if it has NO associated service requests.
 *     tags: [Service Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the service to delete
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *       400:
 *         description: Cannot delete service (has associated requests)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not within unit)
 *       404:
 *         description: Service not found
 */

/**
 * @swagger
 * /cities/services/assigned:
 *   get:
 *     summary: List services assigned to the authenticated Group Leader (GL only)
 *     description: >
 *       Retrieves all service catalog items currently assigned to the authenticated Group Leader.
 *       Results are paginated.
 *     tags: [Service Management]
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
 *         description: Paginated list of assigned services retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /cities/services/public/{unitId}:
 *   get:
 *     summary: Discover services available in a specific Administrative Unit (Public)
 *     description: >
 *       Retrieves all service catalog items created within a specific administrative unit.
 *       This is used by citizens after scanning a QR code to see what services they can request. No authentication required.
 *     tags: [Citizen Operations]
 *     parameters:
 *       - in: path
 *         name: unitId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the Administrative Unit
 *     responses:
 *       200:
 *         description: List of available services and unit information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     unit:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         name:
 *                           type: string
 *                         level:
 *                           type: string
 *                     services:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           type:
 *                             type: string
 *                           place:
 *                             type: string
 *                           duration:
 *                             type: integer
 *                           delivery_mode:
 *                             type: string
 *                           paymentAmount:
 *                             type: string
 *       404:
 *         description: Unit not found
 */

/**
 * @swagger
 * /cities/services/request:
 *   post:
 *     summary: Initiate a service request (Citizen/Public)
 *     description: >
 *       Allows a citizen to initiate a service request by scanning a QR code.
 *       Requires the service ID and the citizen's phone number.
 *       Prevents duplicate active requests from the same phone for the same service.
 *     tags: [Citizen Operations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - service_id
 *               - user_phone
 *             properties:
 *               service_id:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               user_phone:
 *                 type: string
 *                 example: "0911223344"
 *     responses:
 *       201:
 *         description: Service request submitted successfully
 *       400:
 *         description: Invalid input or duplicate active request
 *       404:
 *         description: Service not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /cities/services/requests/assigned:
 *   get:
 *     summary: List assigned service requests (Group Leaders & Officers)
 *     description: >
 *       Retrieves service requests based on the authenticated user's role:
 *       - **Group Leaders**: See all requests for services they are assigned to manage.
 *       - **Officers**: See only the requests explicitly assigned to them as the 'officer_id'.
 *       Results are paginated and ordered by creation date.
 *     tags: [Service Management]
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, REJECTED, IN_PROGRESS, COMPLETED]
 *         description: Filter by status (optional)
 *     responses:
 *       200:
 *         description: Paginated list of assigned requests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     requests:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           status:
 *                             type: string
 *                           user_phone:
 *                             type: string
 *                           Service:
 *                             type: object
 *                             properties:
 *                               type:
 *                                 type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /cities/services/requests/{id}/officer-complete:
 *   put:
 *     summary: Mark a task as completed (Officer/Group Leader)
 *     description: >
 *       Records the completion time by the assigned Officer or an authorized Group Leader. 
 *       This transitions the request towards completion and stops the internal SLA timer part.
 *     tags: [Service Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Request ID
 *     responses:
 *       200:
 *         description: Task marked as completed successfully
 *       400:
 *         description: Invalid state (not in progress)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not assigned to this task/service)
 *       404:
 *         description: Request not found
 */

/**
 * @swagger
 * /cities/services/requests/{id}/citizen-complete:
 *   patch:
 *     summary: Confirm task completion (Citizen/Public)
 *     description: >
 *       Allows a citizen to confirm that the service was successfully delivered. 
 *       Requires the citizen's phone number for validation. 
 *       This finalizes the request status to 'COMPLETED' and triggers the final SLA calculation.
 *     tags: [Citizen Operations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_phone
 *             properties:
 *               user_phone:
 *                 type: string
 *                 example: "0911223344"
 *     responses:
 *       200:
 *         description: Citizen completion confirmed successfully
 *       400:
 *         description: Invalid input or unauthorized phone number
 *       404:
 *         description: Request not found
 */

/**
 * @swagger
 * /cities/services/requests/{id}/reject:
 *   patch:
 *     summary: Reject a service request (Group Leader only)
 *     description: >
 *       Updates the request status to 'REJECTED'. A reason for rejection must be provided.
 *       Only Group Leaders assigned to the specific service can perform this action.
 *     tags: [Service Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rejection_reason
 *             properties:
 *               rejection_reason:
 *                 type: string
 *                 example: "Missing required documents (Citizenship ID)"
 *     responses:
 *       200:
 *         description: Service request rejected successfully
 *       400:
 *         description: Invalid state for rejection or missing reason
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not assigned to this service)
 *       404:
 *         description: Request not found
 */

/**
 * @swagger
 * /cities/services/requests/{id}/assign:
 *   patch:
 *     summary: Assign a service request to an Officer (Group Leader only)
 *     description: >
 *       Assigns a service request to a specific Officer. 
 *       If the request is currently 'PENDING' or 'CONFIRMED', this action will transition 
 *       it to 'IN_PROGRESS' and trigger the SLA timer.
 *       Only Group Leaders assigned to the specific service can perform this action.
 *     tags: [Service Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - officer_id
 *             properties:
 *               officer_id:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Task assigned to officer successfully
 *       400:
 *         description: Invalid officer or invalid request state
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not assigned to this service)
 *       404:
 *         description: Request not found
 */

/**
 * @swagger
 * /services/requests/citizen:
 *   get:
 *     summary: List all service requests for a specific citizen (Public)
 *     description: Retrieves a paginated list of service requests submitted by a citizen, identified by their phone number.
 *     tags: [Citizen Operations]
 *     parameters:
 *       - in: query
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9+]{10,15}$'
 *         description: Citizen's phone number
 *         example: "+251911234567"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, REJECTED, IN_PROGRESS, COMPLETED]
 *         description: Filter by request status
 *     responses:
 *       200:
 *         description: List of citizen service requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       example: 5
 *                     totalPages:
 *                       type: integer
 *                       example: 1
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     requests:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           service_id:
 *                             type: string
 *                             format: uuid
 *                           user_phone:
 *                             type: string
 *                           status:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                           Service:
 *                             type: object
 *                             properties:
 *                               type:
 *                                 type: string
 *                               place:
 *                                 type: string
 *                               duration:
 *                                 type: integer
 *                               quality_standard:
 *                                 type: integer
 *                               delivery_mode:
 *                                 type: string
 *                               paymentAmount:
 *                                 type: string
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Internal server error
 */
