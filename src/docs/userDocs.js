/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Please enter JWT token in the format **Bearer &lt;token&gt;** to access this endpoint.
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               phone_number:
 *                 type: string
 *                 example: "0912345678"
 *               password:
 *                 type: string
 *                 example: "Password123!"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: User registered successfully.
 *
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user_id:
 *                     type: integer
 *                     example: 1
 *                   first_name:
 *                     type: string
 *                     example: John
 *                   last_name:
 *                     type: string
 *                     example: Doe
 *                   phone_number:
 *                     type: string
 *                     example: "0912345678"
 *                   status:
 *                     type: string
 *                     example: assigned
 *       401:
 *         description: Unauthorized, invalid token
 *       500:
 *         description: Internal server error
 */



/**
 * @swagger
 * /users/updateInfo:
 *   patch:
 *     summary: Update user details
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jane
 *               lastName:
 *                 type: string
 *                 example: Smith
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               phoneNumber:
 *                 type: string
 *                 example: "0912345678"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *       401:
 *         description: Unauthorized, invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/updatePassword:
 *   patch:
 *     summary: Change the user's password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Current password of the user
 *                 example: "CurrentPassword123!"
 *               newPassword:
 *                 type: string
 *                 description: New password for the user
 *                 example: "NewPassword456!"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password changed successfully.
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User Login
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone_number:
 *                 type: string
 *                 example: "0912345678"
 *               password:
 *                 type: string
 *                 example: "Password123!"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                       example: 1
 *                     first_name:
 *                       type: string
 *                       example: "John"
 *                     last_name:
 *                       type: string
 *                       example: "Doe"
 *                     phone_number:
 *                       type: string
 *                       example: "0912345678"
 *                     role:
 *                       type: string
 *                       example: "Group Leader"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-10-30T12:00:00Z"
 *       401:
 *         description: Invalid credentials
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
 *                   example: "Invalid credentials"
 */


/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     summary: Request password reset link via email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Reset link sent to the provided email
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
 *                   example: Reset Link sent in your email
 *       404:
 *         description: Email not found in the system
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
 *                   example: No user found with this email
 */

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     summary: Reset password using a valid token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: NewSecurePassword123!
 *     responses:
 *       200:
 *         description: Password reset successful
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
 *                   example: Password reset successfully
 *       400:
 *         description: Invalid or expired token
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
 *                   example: Token is invalid or expired
 *       404:
 *         description: User not found
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
 *                   example: No user found with this userId
 */


/**
 * @swagger
 * /users/sendBulkEmail:
 *   post:
 *     summary: Send a bulk email to multiple recipients
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *                 example: Important Notification
 *               message:
 *                 type: string
 *                 example: This is the same message sent to multiple users.
 *               recipients:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     full_name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *     responses:
 *       200:
 *         description: Emails sent successfully
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
 *                   example: Email sent to 3 recipient(s).
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       batch:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             full_name:
 *                               type: string
 *                               example: John Doe
 *                             email:
 *                               type: string
 *                               example: john.doe@example.com
 *                       status:
 *                         type: string
 *                         example: sent
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/resetPassword/{phoneNumber}:
 *   patch:
 *     summary: Reset user password
 *     description: Resets the user's password to "Password@123". Only accessible by authenticated sub-city leaders.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: phoneNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: The phone number of the user whose password is to be reset.
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
 *                   example: Password reset successfully to Password@123
 *                 data:
 *                   type: object
 *                   description: The updated user information or a confirmation object
 *       401:
 *         description: Unauthorized – missing or invalid token
 *       403:
 *         description: Forbidden – user does not have access
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /users/pendingStatus:
 *   get:
 *     summary: Get all users with pending status
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users with pending status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user_id:
 *                     type: integer
 *                     example: 1
 *                   first_name:
 *                     type: string
 *                     example: John
 *                   last_name:
 *                     type: string
 *                     example: Doe
 *                   phone_number:
 *                     type: string
 *                     example: "0912345678"
 *                   status:
 *                     type: string
 *                     example: assigned
 *       401:
 *         description: Unauthorized, invalid token
 *       500:
 *         description: Internal server error
 */
