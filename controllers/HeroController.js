const path = require("path");
const fs = require("fs");
const Hero = require("../models/Hero");
const cloudinary = require("../utils/cloudinary");

const createHero = async (req, res) => {
  const { heroTitle, heroDesc, heroVideo, heroImage } = req.body;
  console.log("Gelen Veriler:", req.body); // Gelen verileri logla

  try {
    const newHero = new Hero({
      heroTitle,
      heroDesc,
      heroVideo,
      heroImage,
    });

    const savedHero = await newHero.save();
    console.log("Kaydedilen Ders:", savedHero);

    res.status(201).json(newHero);
  } catch (error) {
    console.error("Ders Oluşturma Hatası:", error);

    res.status(500).json({ message: "Ders oluşturulurken bir hata oluştu." });
  }
};
const getHero = async (req, res) => {
  const id = process.env.HERO;
  try {
    const hero = await Hero.findById(id);
    if (!hero) {
      return res.status(404).json({ message: "Section hero bulunamadı." });
    }
    res.status(200).json(hero);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Section hero getirilirken bir hata oluştu." });
  }
};

const updateHero = async (req, res) => {
  console.log("Gelen veriler:", req.body);
  console.log("Yüklenen dosyalar:", req.files);

  const id = process.env.HERO;
  const { heroTitle, heroDesc } = req.body;

  // Create an update object
  const updateData = {
    heroTitle: heroTitle || "",
    heroDesc: heroDesc || "",
  };

  try {
    // Hero'yu bul - herhangi bir güncelleme yapmadan önce varolan veriyi al
    const existingHero = await Hero.findById(id);
    if (!existingHero) {
      return res.status(404).json({ message: "Hero section bulunamadı." });
    }

    // Resim işleme - Cloudinary'ye yükle
    if (req.files && req.files.heroImage && req.files.heroImage[0]) {
      // Eğer mevcut bir resim varsa ve Cloudinary URL'ine sahipse sil
      if (
        existingHero.heroImage &&
        existingHero.heroImage.includes("cloudinary")
      ) {
        try {
          // Cloudinary URL'sinden public_id çıkarma
          const urlParts = existingHero.heroImage.split("/");
          const fileName = urlParts[urlParts.length - 1].split(".")[0];
          const folderName = urlParts[urlParts.length - 2];
          const publicId = `${folderName}/${fileName}`;

          console.log("Eski resim siliniyor:", publicId);
          await cloudinary.uploader.destroy(publicId);
        } catch (deleteError) {
          console.error("Eski resim silinirken hata:", deleteError);
          // Hata olsa bile devam et
        }
      }

      // Yeni resmi Cloudinary'ye yükle
      const imageFile = req.files.heroImage[0];
      const imageUploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "heroes" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary resim yükleme hatası:", error);
              return reject(error);
            }
            resolve(result);
          }
        );

        // Stream API'sini kullanmak için buffer'ı stream'e aktar
        const bufferToStream = require("stream").Readable.from(
          imageFile.buffer
        );
        bufferToStream.pipe(uploadStream);
      });

      const imageResult = await imageUploadPromise;
      updateData.heroImage = imageResult.secure_url;
    } else if (req.body.heroImage && typeof req.body.heroImage === "string") {
      updateData.heroImage = req.body.heroImage;
    }

    // Video işleme - Cloudinary'ye yükle
    if (req.files && req.files.heroVideo && req.files.heroVideo[0]) {
      // Eğer mevcut bir video varsa ve Cloudinary URL'ine sahipse sil
      if (
        existingHero.heroVideo &&
        existingHero.heroVideo.includes("cloudinary")
      ) {
        try {
          // Cloudinary URL'sinden public_id çıkarma
          const urlParts = existingHero.heroVideo.split("/");
          const fileName = urlParts[urlParts.length - 1].split(".")[0];
          const folderName = urlParts[urlParts.length - 2];
          const publicId = `${folderName}/${fileName}`;

          console.log("Eski video siliniyor:", publicId);
          await cloudinary.uploader.destroy(publicId);
        } catch (deleteError) {
          console.error("Eski video silinirken hata:", deleteError);
          // Hata olsa bile devam et
        }
      }

      // Yeni videoyu Cloudinary'ye yükle
      const videoFile = req.files.heroVideo[0];
      const videoUploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "heroes",
            resource_type: "video", // Video yüklemesi için önemli
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary video yükleme hatası:", error);
              return reject(error);
            }
            resolve(result);
          }
        );

        // Stream API'sini kullanmak için buffer'ı stream'e aktar
        const bufferToStream = require("stream").Readable.from(
          videoFile.buffer
        );
        bufferToStream.pipe(uploadStream);
      });

      const videoResult = await videoUploadPromise;
      updateData.heroVideo = videoResult.secure_url;
    } else if (req.body.heroVideo && typeof req.body.heroVideo === "string") {
      updateData.heroVideo = req.body.heroVideo;
    }

    console.log("Update data:", updateData);

    // Veritabanında güncelleme
    const updatedHero = await Hero.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json(updatedHero);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      message: "Section güncellenirken bir hata oluştu.",
      error: error.message,
    });
  }
};

module.exports = {
  getHero,
  createHero,
  updateHero,
};
