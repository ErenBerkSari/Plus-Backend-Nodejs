const path = require("path");
const fs = require("fs");
const WhyUs = require("../models/WhyUs");

const createWhyUs = async (req, res) => {
  const { whyUsTitle, whyUsMainText, features } = req.body;

  try {
    const newWhyUs = new WhyUs({
      whyUsTitle,
      whyUsMainText,
      features, // [{ icon: "bi bi-gem", title: "...", description: "..." }]
    });

    const savedWhyUs = await newWhyUs.save();

    res.status(201).json(savedWhyUs);
  } catch (error) {
    console.error("WhyUs Oluşturma Hatası:", error);
    res.status(500).json({ message: "WhyUs oluşturulurken bir hata oluştu." });
  }
};
const getWhyUs = async (req, res) => {
  const id = process.env.WHYUS;
  try {
    const whyUs = await WhyUs.findById(id);
    if (!whyUs) {
      return res.status(404).json({ message: "Section whyUs bulunamadı." });
    }
    res.status(200).json(whyUs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Section whyUs getirilirken bir hata oluştu." });
  }
};

const updateWhyUs = async (req, res) => {
  const id = process.env.WHYUS;
  const { whyUsTitle, whyUsMainText, features } = req.body;

  // Güncelleme objesi oluştur
  const updateData = {
    whyUsTitle: whyUsTitle || "",
    whyUsMainText: whyUsMainText || "",
    features: features || [],
  };

  // aboutList'in doğru formatta olup olmadığını kontrol et
  if (features && Array.isArray(features)) {
    updateData.features = features;
  } else if (typeof features === "string") {
    // Eğer frontend'den virgülle ayrılmış string olarak gelirse, diziye çevir
    updateData.features = features.split(",").map((item) => item.trim());
  }

  try {
    const updatedWhyUs = await WhyUs.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedWhyUs) {
      return res.status(404).json({ message: "WhyUs bölümü bulunamadı." });
    }

    res.status(200).json(updatedWhyUs);
  } catch (error) {
    console.error("Güncelleme hatası:", error);
    res
      .status(500)
      .json({ message: "WhyUs bölümü güncellenirken hata oluştu." });
  }
};

module.exports = updateWhyUs;

module.exports = {
  getWhyUs,
  createWhyUs,
  updateWhyUs,
};
