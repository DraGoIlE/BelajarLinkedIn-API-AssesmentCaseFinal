const enrollmentService = require('../services/enrollmentService');

const enrollUserToClass = async (req, res) => {
  try {
    const { classId } = req.body;
    const userId = req.user.id;
    const result = await enrollmentService.enrollUserToClass(userId, classId);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    if (['Harap isi ID kelas','Anda sudah terdaftar di kelas ini','Kelas sudah penuh','Kelas tidak ditemukan'].includes(error.message)) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserEnrollments = async (req, res) => {
  try {
    const result = await enrollmentService.getUserEnrollments(req.user.id);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getClassEnrollments = async (req, res) => {
  try {
    const result = await enrollmentService.getClassEnrollments(req.params.classId);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateEnrollmentStatus = async (req, res) => {
  try {
    const result = await enrollmentService.updateEnrollmentStatus(req.params.id, req.body.status);
    res.json(result);
  } catch (error) {
    console.error(error);
    if (error.message === 'Pendaftaran tidak ditemukan') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  enrollUserToClass,
  getUserEnrollments,
  getClassEnrollments,
  updateEnrollmentStatus
};
