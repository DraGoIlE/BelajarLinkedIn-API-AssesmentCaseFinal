const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

class AuthService {
  async registerUser(userData) {
    const { nama, email, password } = userData;
    if (!nama || !email || !password) {
      throw new Error('Harap isi kolom yang tertera');
    }

    // cek email sudah terpakai
    const [existing] = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    if (existing.length > 0) {
      throw new Error('Email ini telah terdaftar');
    }

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (nama, email, password) VALUES (?, ?, ?)',
      [nama, email, hashed]
    );

    return {
      message: 'Registrasi berhasil',
      userId: result.insertId
    };
  }

  async loginUser(userData) {
    const { email, password } = userData;
    if (!email || !password) {
      throw new Error('Harap isi kolom yang tertera');
    }

    const [rows] = await db.execute(
      'SELECT id, nama, email, password FROM users WHERE email = ?',
      [email]
    );
    const user = rows[0];
    if (!user) {
      throw new Error('Data yang dimasukkan salah');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error('Data yang dimasukkan salah');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, nama: user.nama },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      message: 'Login berhasil',
      token,
      user: { id: user.id, nama: user.nama, email: user.email }
    };
  }
}

module.exports = new AuthService();
