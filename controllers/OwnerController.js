const path = require("path");
const fs = require("fs");
const Owner = require("../models/Owner");
const cloudinary = require("../utils/cloudinary");

const createOwner = async (req, res) => {
  try {
    const { ownerName, ownerDesc, ownerTitle } = req.body;

    // Varsayılan değer olarak null ata
    let ownerImage = null;
    let cloudinaryId = null;

    // Eğer resim yüklenmişse Cloudinary'e yükle
    if (req.file) {
      // Cloudinary'e yükleme işlemi
      const imageUploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "owners" },
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
      ownerImage = imageResult.secure_url;
      cloudinaryId = imageResult.public_id;
    }

    const newOwner = new Owner({
      ownerName,
      ownerDesc,
      ownerTitle,
      ownerImage,
      cloudinaryId, // Cloudinary public_id'yi kaydet
    });

    const savedOwner = await newOwner.save();

    res.status(201).json(savedOwner);
  } catch (error) {
    console.error("Ortak Oluşturma Hatası:", error);
    res.status(500).json({ message: "Ortak oluşturulurken bir hata oluştu." });
  }
};

const getAllOwner = async (req, res) => {
  try {
    const owner = await Owner.find();
    if (!owner) {
      return res.status(404).json({ message: "Section owner bulunamadı." });
    }
    res.status(200).json(owner);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Section owner getirilirken bir hata oluştu." });
  }
};

const updateOwner = async (req, res) => {
  const { id } = req.params;
  const { ownerName, ownerDesc, ownerTitle } = req.body;

  const updateData = {
    ownerName,
    ownerDesc,
    ownerTitle,
  };

  try {
    // Önce mevcut owner'ı bul
    const existingOwner = await Owner.findById(id);

    if (!existingOwner) {
      return res.status(404).json({ message: "Owner bulunamadı." });
    }

    // Eğer yeni bir resim yüklenmişse
    if (req.file) {
      // Eski resmi Cloudinary'den sil (eğer varsa)
      if (existingOwner.cloudinaryId) {
        try {
          await cloudinary.uploader.destroy(existingOwner.cloudinaryId);
        } catch (deleteError) {
          console.error("Eski resim silinirken hata:", deleteError);
          // Hata olsa bile devam et
        }
      } else if (
        existingOwner.ownerImage &&
        existingOwner.ownerImage.includes("cloudinary")
      ) {
        try {
          // URL'den public_id çıkar
          const urlParts = existingOwner.ownerImage.split("/");
          const fileName = urlParts[urlParts.length - 1].split(".")[0];
          const folderName = urlParts[urlParts.length - 2];
          const publicId = `${folderName}/${fileName}`;

          await cloudinary.uploader.destroy(publicId);
        } catch (deleteError) {
          console.error("Eski resim silinirken hata:", deleteError);
          // Hata olsa bile devam et
        }
      }

      // Yeni resmi Cloudinary'ye yükle
      const imageUploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "owners" },
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
      updateData.ownerImage = imageResult.secure_url;
      updateData.cloudinaryId = imageResult.public_id;
    }

    // Owner'ı güncelle
    const updatedOwner = await Owner.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json(updatedOwner);
  } catch (error) {
    console.error("🔥 Owner güncellenirken hata:", error);
    res.status(500).json({ message: "Owner güncellenirken hata oluştu." });
  }
};

const deleteOwner = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOwner = await Owner.findByIdAndDelete(id);

    if (!deletedOwner) {
      return res.status(404).json({ message: "Owner bulunamadı." });
    }

    res.status(200).json({ message: "Owner başarıyla silindi." });
  } catch (error) {
    console.error("Owner silinirken hata:", error);
    res.status(500).json({ message: "Owner silinirken hata oluştu." });
  }
};

module.exports = {
  getAllOwner,
  createOwner,
  updateOwner,
  deleteOwner,
};
