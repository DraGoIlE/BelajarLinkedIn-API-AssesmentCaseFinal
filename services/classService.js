const db = require('../config/db');

class ClassService {
  async getAllClasses() {
    const [classes] = await db.execute(
      'SELECT id, kelas, pengajar, durasi, peserta, peserta_maximum FROM classes ORDER BY id ASC'
    );
    return { message: 'Data kelas berhasil diambil', 
      data: classes };
  }

  async getClassById(id) {
    const [rows] = await db.execute(
      'SELECT id, kelas, pengajar, durasi, peserta, peserta_maximum FROM classes WHERE id = ?',
      [id]
    );
    if (rows.length === 0) {
      throw new Error('Kelas tidak ditemukan');
    }
    return { message: 'Data kelas berhasil diambil', data: rows[0] };
  }

  async createClass(data) {
    const { kelas, pengajar, durasi, peserta_maximum } = data;
    if (!kelas || !pengajar || !durasi || !peserta_maximum) {
      throw new Error('Harap isi kolom yang tertera');
    }
    const [result] = await db.execute(
      'INSERT INTO classes (kelas, pengajar, durasi, peserta, peserta_maximum) VALUES (?, ?, ?, 0, ?)',
      [kelas, pengajar, durasi, peserta_maximum]
    );
    return { message: 'Kelas berhasil dibuat', id: result.insertId };
  }

  async updateClass(id, data) {
    const { kelas, pengajar, durasi, peserta_maximum } = data;
    const [result] = await db.execute(
      'UPDATE classes SET kelas = ?, pengajar = ?, durasi = ?, peserta_maximum = ? WHERE id = ?',
      [kelas, pengajar, durasi, peserta_maximum, id]
    );
    if (result.affectedRows === 0) {
      throw new Error('Kelas tidak ditemukan');
    }
    return { message: 'Kelas berhasil diperbarui' };
  }

  async deleteClass(id) {
    const [result] = await db.execute('DELETE FROM classes WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      throw new Error('Kelas tidak ditemukan');
    }
    return { message: 'Kelas berhasil dihapus' };
  }
}

module.exports = new ClassService();
