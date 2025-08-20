
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE classes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kelas VARCHAR(100) NOT NULL,
  pengajar VARCHAR(100) NOT NULL,
  durasi INT NOT NULL COMMENT 'Durasi dalam menit',
  peserta INT NOT NULL DEFAULT 0,
  peserta_maximum INT NOT NULL DEFAULT 50
);

CREATE TABLE enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_user INT NOT NULL,
  id_kelas INT NOT NULL,
  tanggal_daftar DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status ENUM('aktif','selesai','batal') NOT NULL DEFAULT 'aktif',
  FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (id_kelas) REFERENCES classes(id) ON DELETE CASCADE
);

DELIMITER $$
CREATE TRIGGER trg_enroll_after_insert
AFTER INSERT ON enrollments
FOR EACH ROW
BEGIN
  IF NEW.status = 'aktif' THEN
    UPDATE classes SET peserta = peserta + 1 WHERE id = NEW.id_kelas;
  END IF;
END$$

CREATE TRIGGER trg_enroll_after_update
AFTER UPDATE ON enrollments
FOR EACH ROW
BEGIN
  IF OLD.status <> 'aktif' AND NEW.status = 'aktif' THEN
    UPDATE classes SET peserta = peserta + 1 WHERE id = NEW.id_kelas;
  ELSEIF OLD.status = 'aktif' AND NEW.status <> 'aktif' THEN
    UPDATE classes SET peserta = peserta - 1 WHERE id = NEW.id_kelas;
  END IF;
END$$

CREATE TRIGGER trg_enroll_after_delete
AFTER DELETE ON enrollments
FOR EACH ROW
BEGIN
  IF OLD.status = 'aktif' THEN
    UPDATE classes SET peserta = peserta - 1 WHERE id = OLD.id_kelas;
  END IF;
END$$
DELIMITER ;
