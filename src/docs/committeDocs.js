/**
 * @swagger
 * /committees:
 *   post:
 *     summary: Create a new Committee
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
 *               committee_name:
 *                 type: string
 *                 example: "Development Team"
 *                 description: Name of the committee
 *               committee_leader_id:
 *                 type: integer
 *                 example: 2
 *                 description: ID of the user assigned as committee leader
 *               school_address:
 *                 type: string
 *                 example: "Bole Sub-City, Woreda 4, near Edna Mall"
 *                 description: Physical address of the school
 *               school_type:
 *                 type: string
 *                 example: "Private"
 *                 description: Type of the school (e.g. Public, Private)
 *               school_location:
 *                 type: object
 *                 example: { "latitude": 9.0103, "longitude": 38.7613 }
 *                 description: Detailed or long-form description of the school location (can include coordinates or paragraph)
 *               sector_id:
 *                 type: integer
 *                 example: 3
 *                 description: ID of the Sector the committee belongs to
 *     responses:
 *       201:
 *         description: Committee created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 committee_id:
 *                   type: integer
 *                   example: 1
 *                 committee_name:
 *                   type: string
 *                   example: "Development Team"
 *                 committee_leader_id:
 *                   type: integer
 *                   example: 2
 *                 school_address:
 *                   type: string
 *                   example: "Bole Sub-City, Woreda 4, near Edna Mall"
 *                 school_type:
 *                   type: string
 *                   example: "Private"
 *                 school_location:
 *                   type: string
 *                   example: "Addis Ababa, Ethiopia — Latitude: 9.0108, Longitude: 38.7613"
 *                 subcity_id:
 *                   type: integer
 *                   example: 1
 *                 sector_id:
 *                   type: integer
 *                   example: 3
 *                 message:
 *                   type: string
 *                   example: "Committee created successfully."
 */

/**
 * @swagger
 * /committees/{sector_id}:
 *   get:
 *     summary: Retrieve a list of all committees in a specific sector for the logged-in Subcity leader
 *     tags: [Super Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sector_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the sector to filter committees
 *     responses:
 *       200:
 *         description: A list of committees
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   committee_id:
 *                     type: integer
 *                     example: 1
 *                   committee_name:
 *                     type: string
 *                     example: "Development Team"
 *                   committee_leader_id:
 *                     type: integer
 *                     example: 2
 *                   school_address:
 *                     type: string
 *                     example: "Bole Sub-City, Woreda 4, near Edna Mall"
 *                   school_type:
 *                     type: string
 *                     example: "Private"
 *                   school_location:
 *                     type: string
 *                     example: "Addis Ababa, Ethiopia — Latitude: 9.0108, Longitude: 38.7613"
 *                   subcity_id:
 *                     type: integer
 *                     example: 1
 *                   sector_id:
 *                     type: integer
 *                     example: 3
 *                   committee_Leader:
 *                     type: object
 *                     properties:
 *                       first_name:
 *                         type: string
 *                         example: "John"
 *                       last_name:
 *                         type: string
 *                         example: "Doe"
 *                       email:
 *                         type: string
 *                         example: "john.doe@example.com"
 *                       phone_number:
 *                         type: string
 *                         example: "+251912345678"
 *                       status:
 *                         type: string
 *                         example: "active"
 *       400:
 *         description: Bad request (e.g., missing sector_id or user not a Subcity leader)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /committees/updateName/{committee_id}:
 *   patch:
 *     summary: Update Sector information
 *     tags: [Super Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: committee_id
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
 *               committee_name:
 *                 type: string
 *                 example: "Updated Group Name"
 *               school_address:
 *                 type: string
 *                 example: "Bole Sub-City, Woreda 4, near Edna Mall"
 *                 description: Physical address of the school
 *               school_type:
 *                 type: string
 *                 example: "Private"
 *                 description: Type of the school (e.g. Public, Private)
 *               school_location:
 *                 type: string
 *                 example: "Addis Ababa, Ethiopia — Latitude: 9.0108, Longitude: 38.7613"
 *                 description: Detailed or long-form description of the school location (can include coordinates or paragraph)
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
 * /committees/assign:
 *   patch:
 *     summary: Assign a new leader to a committees
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
 *               committee_id:
 *                 type: integer
 *                 example: 1
 *               new_committee_leader_id:
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
 * /committees/unassign/{user_id}:
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
 * /committees/resetPassword:
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
 *               committee_leader_id:
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
 * /committees/allCommitteeLeaders:
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
/**
 * @swagger
 * /committees/create-attencance:
 *   post:
 *     summary: Record a user's attendance
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 5
 *               committee_id:
 *                 type: integer
 *                 example: 2
 *               check_in_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-11-08T08:30:00Z"
 *               check_out_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-11-08T16:30:00Z"
 *               comments:
 *                 type: string
 *                 example: "Attended project review meeting"
 *               device_info:
 *                 type: object
 *                 example: { "device": "Samsung Galaxy S21", "ip": "192.168.1.10" }
 *               location:
 *                 type: object
 *                 example: { "latitude": 9.0103, "longitude": 38.7613 }
 *     responses:
 *       201:
 *         description: Attendance recorded successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
