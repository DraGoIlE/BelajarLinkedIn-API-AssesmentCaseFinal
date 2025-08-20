const express = require('express');
const router = express.Router();
const {
  enrollUserToClass,
  getUserEnrollments,
  getClassEnrollments,
  updateEnrollmentStatus
} = require('../server/enrollmentController');
const authenticateToken = require('../middleware/auth');

router.post('/enroll', authenticateToken, enrollUserToClass);
router.get('/my-enrollments', authenticateToken, getUserEnrollments);
router.get('/class/:classId', authenticateToken, getClassEnrollments);
router.put('/:id', authenticateToken, updateEnrollmentStatus);

module.exports = router;
