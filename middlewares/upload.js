// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Use a relative path for uploads
// const uploadDir = path.join(__dirname, "../uploads/hero");

// // Klasör yoksa oluştur
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// // Filtreleme: Sadece resim ve video yüklemeye izin ver
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ["image/jpeg", "image/png", "video/mp4"];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Geçersiz dosya türü. Sadece JPG, PNG ve MP4 yüklenebilir."));
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
// });

// module.exports = upload;
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Dinamik olarak klasör oluşturma fonksiyonu
const ensureDirectoryExistence = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // API endpoint veya body'den gelen veriyle klasör belirleme
    let uploadFolder = "general"; // Varsayılan klasör

    if (req.baseUrl.includes("product")) {
      uploadFolder = "products";
    } else if (req.baseUrl.includes("owner")) {
      uploadFolder = "owners";
    } else if (req.baseUrl.includes("hero")) {
      uploadFolder = "hero";
    } else if (req.baseUrl.includes("gallery")) {
      uploadFolder = "gallery";
    } else if (req.baseUrl.includes("contact")) {
      uploadFolder = "contact";
    } else if (req.baseUrl.includes("about")) {
      uploadFolder = "about";
    } else if (req.baseUrl.includes("why-us")) {
      uploadFolder = "why-us";
    }

    const uploadDir = path.join(__dirname, `../uploads/${uploadFolder}`);
    ensureDirectoryExistence(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Geçerli dosya türleri
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "video/mp4"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Geçersiz dosya türü. Sadece JPG, PNG ve MP4 yüklenebilir."));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
