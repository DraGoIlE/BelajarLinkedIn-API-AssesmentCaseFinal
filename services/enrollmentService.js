const db = require('../config/db');

class EnrollmentService {
  async enrollUserToClass(userId, classId) {
    if (!classId) {
      throw new Error('Harap isi ID kelas');
    }

    // cek kelas
    const [classes] = await db.execute(
      'SELECT id, peserta, peserta_maximum FROM classes WHERE id = ?',
      [classId]
    );
    const kelas = classes[0];
    if (!kelas) {
      throw new Error('Kelas tidak ditemukan');
    }
    if (kelas.peserta >= kelas.peserta_maximum) {
      throw new Error('Kelas sudah penuh');
    }

    // cek sudah terdaftar
    const [existing] = await db.execute(
      'SELECT id FROM enrollments WHERE id_user = ? AND id_kelas = ? AND status = "aktif"',
      [userId, classId]
    );
    if (existing.length > 0) {
      throw new Error('Anda sudah terdaftar di kelas ini');
    }

    // daftar
    const [ins] = await db.execute(
      'INSERT INTO enrollments (id_user, id_kelas, tanggal_daftar, status) VALUES (?, ?, NOW(), "aktif")',
      [userId, classId]
    );

    // update peserta
    await db.execute(
      'UPDATE classes SET peserta = peserta + 1 WHERE id = ?',
      [classId]
    );

    return { message: 'Pendaftaran berhasil', id: ins.insertId };
  }

  async getUserEnrollments(userId) {
    const [rows] = await db.execute(
      `SELECT
         e.id AS id_daftar,
         e.tanggal_daftar,
         e.status,
         c.id AS id_kelas,
         c.kelas,
         c.pengajar,
         c.durasi
       FROM enrollments e
       JOIN classes c ON e.id_kelas = c.id
       WHERE e.id_user = ?
       ORDER BY e.tanggal_daftar DESC`,
      [userId]
    );
    return { message: 'Data pendaftaran berhasil diambil', data: rows };
  }

  async getClassEnrollments(classId) {
    const [rows] = await db.execute(
      `SELECT
         e.id AS id_daftar,
         e.tanggal_daftar,
         e.status,
         u.id AS id_user,
         u.nama,
         u.email
       FROM enrollments e
       JOIN users u ON e.id_user = u.id
       WHERE e.id_kelas = ?
       ORDER BY e.tanggal_daftar DESC`,
      [classId]
    );
    return { message: 'Data pendaftaran berhasil diambil', data: rows };
  }

  async updateEnrollmentStatus(enrollmentId, status) {
    const [rows] = await db.execute(
      'SELECT id, id_kelas, status FROM enrollments WHERE id = ?',
      [enrollmentId]
    );
    const current = rows[0];
    if (!current) {
      throw new Error('Pendaftaran tidak ditemukan');
    }
    if (current.status === status) {
      return { message: 'Status tidak berubah' };
    }

    // sesuaikan jumlah peserta jika berubah ke/bukan "aktif"
    if (current.status !== 'aktif' && status === 'aktif') {
      await db.execute('UPDATE classes SET peserta = peserta + 1 WHERE id = ?', [current.id_kelas]);
    } else if (current.status === 'aktif' && status !== 'aktif') {
      await db.execute('UPDATE classes SET peserta = peserta - 1 WHERE id = ?', [current.id_kelas]);
    }

    await db.execute('UPDATE enrollments SET status = ? WHERE id = ?', [status, enrollmentId]);
    return { message: 'Status pendaftaran diperbarui' };
  }
}

module.exports = new EnrollmentService();
