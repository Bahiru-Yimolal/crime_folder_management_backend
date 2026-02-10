/**
 * @swagger
 * /sectors:
 *   post:
 *     summary: Create a new Sector (Subcity Admin only)
 *     tags: [Subcity Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Education Sector"
 *                 description: Name of the sector to create
 *     responses:
 *       201:
 *         description: Sector created successfully
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
 *                   example: "Sector created successfully"
 *                 sector:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     name:
 *                       type: string
 *                       example: "Education Sector"
 *                     level:
 *                       type: string
 *                       example: "SECTOR"
 *                     parent_id:
 *                       type: string
 *                       format: uuid
 *                       example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 *       400:
 *         description: Invalid input or sector already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /sectors:
 *   get:
 *     summary: List all sectors for the current Subcity (Subcity Admin only)
 *     tags: [Subcity Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sectors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 sectors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       name:
 *                         type: string
 *                         example: "Education Sector"
 *                       level:
 *                         type: string
 *                         example: "SECTOR"
 *                       parent_id:
 *                         type: string
 *                         format: uuid
 *                       UserAssignments:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               format: uuid
 *                             User:
 *                               type: object
 *                               properties:
 *                                 first_name:
 *                                   type: string
 *                                 last_name:
 *                                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /sectors/{id}:
 *   put:
 *     summary: Update sector information (Subcity Admin only)
 *     tags: [Subcity Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the sector to update
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
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Health Sector"
 *     responses:
 *       200:
 *         description: Sector updated successfully
 *       400:
 *         description: Invalid input or duplicate name
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Sector not found
 */

/**
 * @swagger
 * /sectors/{id}:
 *   delete:
 *     summary: Delete a sector (Subcity Admin only)
 *     tags: [Subcity Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the sector to delete
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Sector deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Sector not found
 */

/**
 * @swagger
 * /sectors/assign/sector-admin:
 *   post:
 *     summary: Assign a Sector Admin to a Sector (Subcity Admin only)
 *     tags: [Subcity Admin]
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
 *               - sectorId
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the user to be assigned
 *               sectorId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the sector
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Sector Admin assigned successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User or sector not found
 */

/**
 * @swagger
 * /sectors/assign/users:
 *   post:
 *     summary: Create/Assign a User to the Sector (Subcity Admin only)
 *     tags: [Subcity Admin]
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
 *                 description: ID of the user to assign
 *               role:
 *                 type: string
 *                 description: Role name to assign (e.g., SECTOR_OFFICER)
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Optional specific permissions
 *     responses:
 *       201:
 *         description: User assigned successfully
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Forbidden
 *   put:
 *     summary: Update a Sector User's Role/Permissions (Subcity Admin only)
 *     tags: [Subcity Admin]
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
 *             properties:
 *               user_id:
 *                 type: string
 *                 format: uuid
 *               role:
 *                 type: string
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found or not in sector
 */

/**
 * @swagger
 * /sectors/assign/own-users:
 *   post:
 *     summary: Create/Assign a User to the Sector (Sector Admin only - Self Management)
 *     tags: [Sector Admin]
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
 *                 description: ID of the user to assign
 *               role:
 *                 type: string
 *                 description: Role name to assign (e.g., SECTOR_OFFICER)
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Optional specific permissions
 *     responses:
 *       201:
 *         description: User assigned successfully
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Forbidden
 *   put:
 *     summary: Update a Sector User's Role/Permissions (Sector Admin only - Self Management)
 *     tags: [Sector Admin]
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
 *             properties:
 *               user_id:
 *                 type: string
 *                 format: uuid
 *               role:
 *                 type: string
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found or not in sector
 */
