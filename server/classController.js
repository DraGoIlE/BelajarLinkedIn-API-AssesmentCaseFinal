const classService = require('../services/classService');

const getAllClasses = async (req, res) => {
  try {
    const result = await classService.getAllClasses();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getClassById = async (req, res) => {
  try {
    const result = await classService.getClassById(req.params.id);
    res.json(result);
  } catch (error) {
    console.error(error);
    if (error.message === 'Kelas tidak ditemukan') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createClass = async (req, res) => {
  try {
    const result = await classService.createClass(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    if (error.message === 'Harap isi kolom yang tertera') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateClass = async (req, res) => {
  try {
    const result = await classService.updateClass(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    console.error(error);
    if (error.message === 'Kelas tidak ditemukan') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteClass = async (req, res) => {
  try {
    const result = await classService.deleteClass(req.params.id);
    res.json(result);
  } catch (error) {
    console.error(error);
    if (error.message === 'Kelas tidak ditemukan') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass
};
