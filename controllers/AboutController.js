const path = require("path");
const fs = require("fs");
const About = require("../models/About");

const createAbout = async (req, res) => {
  const {
    aboutIntro,
    aboutList,
    aboutLastText,
    aboutVideo,
    aboutImage,
    aboutContact,
  } = req.body;
  console.log("Gelen Veriler:", req.body); // Gelen verileri logla

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
    console.log("Kaydedilen Ders:", savedAbout);

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
  console.log("Gelen veriler:", req.body);
  console.log("Yüklenen dosyalar:", req.files);

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

  // Resim dosyası kontrolü
  if (req.files?.aboutImage?.[0]) {
    const filePath = req.files.aboutImage[0].path;
    const relativePath = filePath.split("uploads")[1];
    updateData.aboutImage = `/uploads${relativePath}`.replace(/\\/g, "/");
  } else if (req.body.aboutImage && typeof req.body.aboutImage === "string") {
    updateData.aboutImage = req.body.aboutImage;
  }

  // Video dosyası kontrolü
  if (req.files?.aboutVideo?.[0]) {
    const filePath = req.files.aboutVideo[0].path;
    const relativePath = filePath.split("uploads")[1];
    updateData.aboutVideo = `/uploads${relativePath}`.replace(/\\/g, "/");
  } else if (req.body.aboutVideo && typeof req.body.aboutVideo === "string") {
    updateData.aboutVideo = req.body.aboutVideo;
  }

  console.log("Update data:", updateData);

  try {
    const updatedAbout = await About.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedAbout) {
      return res.status(404).json({ message: "About bölümü bulunamadı." });
    }

    res.status(200).json(updatedAbout);
  } catch (error) {
    console.error("Güncelleme hatası:", error);
    res
      .status(500)
      .json({ message: "About bölümü güncellenirken hata oluştu." });
  }
};

module.exports = {
  getAbout,
  createAbout,
  updateAbout,
};
