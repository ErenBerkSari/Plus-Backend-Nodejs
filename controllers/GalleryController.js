const path = require("path");
const fs = require("fs");
const Gallery = require("../models/Gallery");

// 📌 Tüm resimleri getir
const getAllImages = async (req, res) => {
  try {
    const images = await Gallery.find();
    if (!images.length) {
      return res.status(404).json({ message: "Galeri boş." });
    }
    res.status(200).json(images);
  } catch (error) {
    console.error("🔥 Resimler getirilirken hata:", error);
    res.status(500).json({ message: "Resimler getirilirken hata oluştu." });
  }
};

// 📌 Yeni resim ekle
const uploadImage = async (req, res) => {
  console.log("📩 Gelen Veriler:", req.body);
  console.log("🖼️ Yüklenen Dosya:", req.file);

  try {
    if (!req.file) {
      return res.status(400).json({ message: "Lütfen bir resim yükleyin." });
    }

    const imageUrl = `/uploads/gallery/${req.file.filename}`;

    const newImage = new Gallery({ imageUrl });
    const savedImage = await newImage.save();

    console.log("✅ Kaydedilen Resim:", savedImage);
    res.status(201).json(savedImage);
  } catch (error) {
    console.error("🔥 Resim yüklenirken hata:", error);
    res.status(500).json({ message: "Resim yüklenirken hata oluştu." });
  }
};

// 📌 Resmi sil
const deleteImage = async (req, res) => {
  const { id } = req.params;

  try {
    const image = await Gallery.findById(id);
    if (!image) {
      return res.status(404).json({ message: "Resim bulunamadı." });
    }

    // Dosyayı fiziksel olarak da silmek için:
    const filePath = path.join(__dirname, "..", image.imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Gallery.findByIdAndDelete(id);
    res.status(200).json({ message: "Resim başarıyla silindi." });
  } catch (error) {
    console.error("🔥 Resim silinirken hata:", error);
    res.status(500).json({ message: "Resim silinirken hata oluştu." });
  }
};

module.exports = {
  getAllImages,
  uploadImage,
  deleteImage,
};
