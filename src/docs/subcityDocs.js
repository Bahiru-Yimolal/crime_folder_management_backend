/**
 * @swagger
 * /subcities:
 *   post:
 *     summary: Create new subcities
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subcity_name:
 *                 type: string
 *                 example: Akaki
 *               subcity_leader_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: subcity created successfully
 *       401:
 *         description: Unauthorized, please provide a valid token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /subcities:
 *   get:
 *     summary: Fetch all subcities
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of subcities with assigned users
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
 *                       subcity_id:
 *                         type: integer
 *                         example: 1
 *                       subcity_name:
 *                         type: string
 *                         example: Software Engineer
 *                       sector_id:
 *                         type: integer
 *                         example: 5
 *                       assignedUser:
 *                         type: object
 *                         properties:
 *                           user_id:
 *                             type: integer
 *                             example: 2
 *                           first_name:
 *                             type: string
 *                             example: John
 *                           last_name:
 *                             type: string
 *                             example: Doe
 *                           phone_number:
 *                             type: string
 *                             example: "0912345678"
 *       401:
 *         description: Unauthorized, invalid token
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /subcities/allSubcityLeaders:
 *   get:
 *     summary: Fetch all Subcity Leaders
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of Subcity Leaders
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

/**
 * @swagger
 * /subcities/unassign/{user_id}:
 *   patch:
 *     summary: Unassign a user by changing their status from assigned to pending
 *     tags: [Admin]
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
 * /subcities/resetPassword:
 *   patch:
 *     summary: Reset a subcity leader password to the default
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subcity_leader_id:
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
 * /subcities/updateName/{subcity_id}:
 *   patch:
 *     summary: Update Subcity information
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subcity_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the Subcity to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subcity_name:
 *                 type: string
 *                 example: "Updated subcity Name"
 *     responses:
 *       200:
 *         description: subcity updated successfully
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
 *                   example: "Updated Division Name"
 *                 message:
 *                   type: string
 *                   example: "Division updated successfully."
 *       400:
 *         description: Bad request, invalid parameters
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /subcities/assign:
 *   patch:
 *     summary: Assign a new Sector Leader to a division
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subcity_id:
 *                 type: integer
 *                 example: 1
 *               new_subcity_leader_id:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Sector leader assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 coordinator_id:
 *                   type: integer
 *                   example: 1
 *                 new__id:
 *                   type: integer
 *                   example: 5
 *                 message:
 *                   type: string
 *                   example: "coordinator assigned successfully."
 */
