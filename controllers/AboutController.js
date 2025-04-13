const path = require("path");
const fs = require("fs");
const About = require("../models/About");
const cloudinary = require("../utils/cloudinary");

const createAbout = async (req, res) => {
  const {
    aboutIntro,
    aboutList,
    aboutLastText,
    aboutVideo,
    aboutImage,
    aboutContact,
  } = req.body;

  try {
    const newAbout = new About({
      aboutIntro,
      aboutList,
      aboutLastText,
      aboutVideo,
      aboutImage,
      aboutContact,
    });

    const savedAbout = await newAbout.save();

    res.status(201).json(newAbout);
  } catch (error) {
    console.error("Ders Oluşturma Hatası:", error);

    res.status(500).json({ message: "Ders oluşturulurken bir hata oluştu." });
  }
};

const getAbout = async (req, res) => {
  const id = process.env.ABOUT;
  try {
    const about = await About.findById(id);
    if (!about) {
      return res.status(404).json({ message: "Section about bulunamadı." });
    }
    res.status(200).json(about);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Section about getirilirken bir hata oluştu." });
  }
};

const updateAbout = async (req, res) => {
  const id = process.env.ABOUT;
  const { aboutIntro, aboutList, aboutLastText, aboutContact } = req.body;

  // Güncelleme objesi oluştur
  const updateData = {
    aboutIntro: aboutIntro || "",
    aboutLastText: aboutLastText || "",
    aboutContact: aboutContact || "",
  };

  // aboutList'in doğru formatta olup olmadığını kontrol et
  if (aboutList) {
    try {
      // JSON string olarak geldiyse parse et
      if (typeof aboutList === "string") {
        try {
          updateData.aboutList = JSON.parse(aboutList);
        } catch (e) {
          // JSON parse edilemezse virgülle ayrılmış string olarak düşün
          updateData.aboutList = aboutList
            .split(",")
            .map((item) => item.trim());
        }
      } else if (Array.isArray(aboutList)) {
        // Zaten array ise direkt kullan
        updateData.aboutList = aboutList;
      }
    } catch (error) {
      console.error("aboutList parse hatası:", error);
      // Hata durumunda boş dizi olarak ayarla
      updateData.aboutList = [];
    }
  } else {
    // aboutList yoksa boş dizi olarak ayarla
    updateData.aboutList = [];
  }

  try {
    // Mevcut about verisini al
    const existingAbout = await About.findById(id);
    if (!existingAbout) {
      return res.status(404).json({ message: "About bölümü bulunamadı." });
    }

    // Resim dosyası işleme - Cloudinary
    if (req.files && req.files.aboutImage && req.files.aboutImage[0]) {
      // Eski resmi sil (eğer cloudinary'de ise)
      if (
        existingAbout.aboutImage &&
        existingAbout.aboutImage.includes("cloudinary")
      ) {
        try {
          // Cloudinary URL'inden public_id çıkarma
          const urlParts = existingAbout.aboutImage.split("/");
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
      const imageFile = req.files.aboutImage[0];
      const imageUploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "about" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary resim yükleme hatası:", error);
              return reject(error);
            }
            resolve(result);
          }
        );

        // Buffer'ı stream'e dönüştür
        const bufferToStream = require("stream").Readable.from(
          imageFile.buffer
        );
        bufferToStream.pipe(uploadStream);
      });

      const imageResult = await imageUploadPromise;
      updateData.aboutImage = imageResult.secure_url;
    } else if (req.body.aboutImage && typeof req.body.aboutImage === "string") {
      updateData.aboutImage = req.body.aboutImage;
    }

    // Video dosyası işleme - Cloudinary
    if (req.files && req.files.aboutVideo && req.files.aboutVideo[0]) {
      // Eski videoyu sil (eğer cloudinary'de ise)
      if (
        existingAbout.aboutVideo &&
        existingAbout.aboutVideo.includes("cloudinary")
      ) {
        try {
          // Cloudinary URL'inden public_id çıkarma
          const urlParts = existingAbout.aboutVideo.split("/");
          const fileName = urlParts[urlParts.length - 1].split(".")[0];
          const folderName = urlParts[urlParts.length - 2];
          const publicId = `${folderName}/${fileName}`;

          await cloudinary.uploader.destroy(publicId, {
            resource_type: "video",
          });
        } catch (deleteError) {
          console.error("Eski video silinirken hata:", deleteError);
          // Hata olsa bile devam et
        }
      }

      // Yeni videoyu Cloudinary'ye yükle
      const videoFile = req.files.aboutVideo[0];
      const videoUploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "about",
            resource_type: "video", // Video yüklemesi için
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary video yükleme hatası:", error);
              return reject(error);
            }
            resolve(result);
          }
        );

        // Buffer'ı stream'e dönüştür
        const bufferToStream = require("stream").Readable.from(
          videoFile.buffer
        );
        bufferToStream.pipe(uploadStream);
      });

      const videoResult = await videoUploadPromise;
      updateData.aboutVideo = videoResult.secure_url;
    } else if (req.body.aboutVideo && typeof req.body.aboutVideo === "string") {
      updateData.aboutVideo = req.body.aboutVideo;
    }

    // Veritabanında güncelleme
    const updatedAbout = await About.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json(updatedAbout);
  } catch (error) {
    console.error("Güncelleme hatası:", error);
    res.status(500).json({
      message: "About bölümü güncellenirken hata oluştu.",
      error: error.message,
    });
  }
};

module.exports = {
  getAbout,
  createAbout,
  updateAbout,
};
