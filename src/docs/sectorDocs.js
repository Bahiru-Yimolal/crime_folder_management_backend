/**
 * @swagger
 * /sectors:
 *   post:
 *     summary: Create a new Sector
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
 *               sector_name:
 *                 type: string
 *                 example: "Development Team"
 *                 description: Name of the group
 *               sector_leader_id:
 *                 type: integer
 *                 example: 2
 *                 description: ID of the user assigned as Sector leader
 *     responses:
 *       201:
 *         description: Sector created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 group_id:
 *                   type: integer
 *                   example: 1
 *                 group_name:
 *                   type: string
 *                   example: "Development Team"
 *                 group_leader_id:
 *                   type: integer
 *                   example: 2
 *                 message:
 *                   type: string
 *                   example: "Group created successfully."
 */

/**
 * @swagger
 * /sectors:
 *   get:
 *     summary: Retrieve a list of all Sectors
 *     tags: [Super Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of Sector
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   group_id:
 *                     type: integer
 *                     example: 1
 *                   group_name:
 *                     type: string
 *                     example: "Development Team"
 *                   group_leader_id:
 *                     type: integer
 *                     example: 2
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /sectors/updateName/{sector_id}:
 *   patch:
 *     summary: Update Sector information
 *     tags: [Super Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sector_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the sector to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sector_name:
 *                 type: string
 *                 example: "Updated Group Name"
 *     responses:
 *       200:
 *         description: Group updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 group_id:
 *                   type: integer
 *                   example: 1
 *                 group_name:
 *                   type: string
 *                   example: "Updated Group Name"
 *                 message:
 *                   type: string
 *                   example: "Group updated successfully."
 *       400:
 *         description: Bad request, invalid parameters
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /sectors/assign:
 *   patch:
 *     summary: Assign a new leader to a Sector
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
 *               sector_id:
 *                 type: integer
 *                 example: 1
 *               new_sector_leader_id:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Group leader assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 group_id:
 *                   type: integer
 *                   example: 1
 *                 new_group_leader_id:
 *                   type: integer
 *                   example: 5
 *                 message:
 *                   type: string
 *                   example: "Group leader assigned successfully."
 */

/**
 * @swagger
 * /sectors/unassign/{user_id}:
 *   patch:
 *     summary: Unassign a user by changing their status from assigned to pending
 *     tags: [Super Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to unassign
 *         example: 1
 *     responses:
 *       200:
 *         description: User status changed to pending successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User status changed to pending successfully.
 */

/**
 * @swagger
 * /sectors/resetPassword:
 *   patch:
 *     summary: Reset a 's password to the default
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
 *               sector_leader_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Password reset successfully
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
 *                   example: Password reset successfully to default for user ID 2
 *       403:
 *         description: Access denied (only group leaders can reset passwords)
 *       404:
 *         description: Professional not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /sectors/allSectorLeaders:
 *   get:
 *     summary: Fetch all sector leaders in the same subcity
 *     tags: [Super Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users in the same sector
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
 *                         type: integer
 *                         example: 1
 *                       first_name:
 *                         type: string
 *                         example: John
 *                       last_name:
 *                         type: string
 *                         example: Doe
 *                       phone_number:
 *                         type: string
 *                         example: "0912345678"
 *       401:
 *         description: Unauthorized, invalid token
 *       500:
 *         description: Server error
 */
