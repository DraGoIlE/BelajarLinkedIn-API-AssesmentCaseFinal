const express = require('express');
const {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass
} = require('../server/classController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllClasses);
router.get('/:id', getClassById);
router.post('/', authenticateToken, createClass);
router.put('/:id', authenticateToken, updateClass);
router.delete('/:id', authenticateToken, deleteClass);

module.exports = router;
