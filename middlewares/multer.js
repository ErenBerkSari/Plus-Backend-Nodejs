const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "plus_uploads", // Cloudinary klasör adı
    allowed_formats: ["jpg", "png", "jpeg", "webp", "mp4"],
  },
});

const upload = multer({ storage });

module.exports = upload;
