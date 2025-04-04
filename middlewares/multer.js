const multer = require("multer");

// Multer'ı belleğe kaydedecek şekilde ayarla (dosya sistemine değil)
const storage = multer.memoryStorage();

// Dosya filtreleme fonksiyonu
const fileFilter = (req, file, cb) => {
  // Resim için kabul edilebilir MIME tipleri
  if (file.fieldname === "heroImage") {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/webp" ||
      file.mimetype === "image/gif"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Desteklenmeyen resim dosya formatı! Lütfen JPEG, PNG, WebP veya GIF yükleyin."
        ),
        false
      );
    }
  }
  // Video için kabul edilebilir MIME tipleri
  else if (file.fieldname === "heroVideo") {
    if (
      file.mimetype === "video/mp4" ||
      file.mimetype === "video/webm" ||
      file.mimetype === "video/mov" ||
      file.mimetype === "video/quicktime"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Desteklenmeyen video dosya formatı! Lütfen MP4, WebM veya MOV yükleyin."
        ),
        false
      );
    }
  } else {
    cb(null, true);
  }
};

// Dosya boyut limitleri
const limits = {
  fileSize: 50 * 1024 * 1024, // 50MB limit
};

// Multer yapılandırması
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits,
});

module.exports = upload;
