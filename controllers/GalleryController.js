const path = require("path");
const fs = require("fs");
const Gallery = require("../models/Gallery");
const cloudinary = require("../utils/cloudinary");

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
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Lütfen bir resim yükleyin." });
    }

    // Cloudinary'e yükleme işlemi
    const imageUploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "gallery" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary resim yükleme hatası:", error);
            return reject(error);
          }
          resolve(result);
        }
      );

      // Buffer'ı stream'e dönüştür
      const bufferToStream = require("stream").Readable.from(req.file.buffer);
      bufferToStream.pipe(uploadStream);
    });

    const imageResult = await imageUploadPromise;
    const imageUrl = imageResult.secure_url;

    const newImage = new Gallery({
      imageUrl,
      cloudinaryId: imageResult.public_id, // Silme işlemi için public_id'yi de saklayalım
    });

    const savedImage = await newImage.save();

    res.status(201).json(savedImage);
  } catch (error) {
    console.error("🔥 Resim yüklenirken hata:", error);
    res.status(500).json({ message: "Resim yüklenirken hata oluştu." });
  }
};

// 📌 Resmi sil
// 📌 Resmi sil
const deleteImage = async (req, res) => {
  const { id } = req.params;

  try {
    const image = await Gallery.findById(id);
    if (!image) {
      return res.status(404).json({ message: "Resim bulunamadı." });
    }

    // Cloudinary'den resmi sil
    if (image.cloudinaryId) {
      // Doğrudan cloudinaryId kullanarak sil
      await cloudinary.uploader.destroy(image.cloudinaryId);
    } else if (image.imageUrl && image.imageUrl.includes("cloudinary")) {
      try {
        // Eski kodlarda cloudinaryId yoksa URL'den çıkarmayı dene
        const urlParts = image.imageUrl.split("/");
        const fileName = urlParts[urlParts.length - 1].split(".")[0];
        const folderName = urlParts[urlParts.length - 2];
        const publicId = `${folderName}/${fileName}`;

        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.error("Cloudinary'den resim silinirken hata:", deleteError);
        // Hata olsa bile veritabanından silmeye devam et
      }
    }

    // Veritabanından resmi sil
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
