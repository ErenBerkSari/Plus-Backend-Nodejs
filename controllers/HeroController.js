const path = require("path");
const fs = require("fs");
const Hero = require("../models/Hero");

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

  // Handle image file if it exists
  if (req.files && req.files.heroImage && req.files.heroImage[0]) {
    // Convert file path to URL path
    const filePath = req.files.heroImage[0].path;
    const relativePath = filePath.split("uploads")[1]; // Get the part after 'uploads'
    updateData.heroImage = `/uploads${relativePath}`.replace(/\\/g, "/"); // Ensure forward slashes
  } else if (req.body.heroImage && typeof req.body.heroImage === "string") {
    updateData.heroImage = req.body.heroImage;
  }

  // Handle video file if it exists
  if (req.files && req.files.heroVideo && req.files.heroVideo[0]) {
    // Convert file path to URL path
    const filePath = req.files.heroVideo[0].path;
    const relativePath = filePath.split("uploads")[1]; // Get the part after 'uploads'
    updateData.heroVideo = `/uploads${relativePath}`.replace(/\\/g, "/"); // Ensure forward slashes
  } else if (req.body.heroVideo && typeof req.body.heroVideo === "string") {
    updateData.heroVideo = req.body.heroVideo;
  }

  console.log("Update data:", updateData);

  try {
    const updatedHero = await Hero.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedHero) {
      return res.status(404).json({ message: "Hero section bulunamadı." });
    }

    res.status(200).json(updatedHero);
  } catch (error) {
    console.error("Update error:", error);
    res
      .status(500)
      .json({ message: "Section güncellenirken bir hata oluştu." });
  }
};

module.exports = {
  getHero,
  createHero,
  updateHero,
};
