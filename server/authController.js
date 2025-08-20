const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    if (error.message === 'Harap isi kolom yang tertera' ||
        error.message === 'Email ini telah terdaftar') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    res.json(result);
  } catch (error) {
    console.error(error);
    if (error.message === 'Harap isi kolom yang tertera' ||
        error.message === 'Data yang dimasukkan salah') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { register, login };
