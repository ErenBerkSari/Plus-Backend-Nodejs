const path = require("path");
const fs = require("fs");
const Owner = require("../models/Owner");

const createOwner = async (req, res) => {
  console.log("Gelen Veriler:", req.body);
  console.log("Yüklenen Dosyalar:", req.file); // Tekli dosya yükleme varsa

  try {
    const { ownerName, ownerDesc, ownerTitle } = req.body;

    // Yüklenen görselin yolunu al
    const ownerImage = req.file ? `/uploads/owners/${req.file.filename}` : null;

    const newOwner = new Owner({
      ownerName,
      ownerDesc,
      ownerTitle,
      ownerImage,
    });

    const savedOwner = await newOwner.save();
    console.log("Kaydedilen ortak:", savedOwner);

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
  console.log("📩 Gelen Veriler:", req.body);
  console.log("🖼️ Yüklenen Dosya:", req.file);

  const { id } = req.params;
  const { ownerName, ownerDesc, ownerTitle } = req.body;

  const updateData = {
    ownerName,
    ownerDesc,
    ownerTitle,
  };

  // Eğer yeni bir resim yüklenmişse, güncelle
  if (req.file) {
    const filePath = req.file.path;
    const relativePath = filePath.split("uploads")[1];
    updateData.ownerImage = `/uploads${relativePath}`.replace(/\\/g, "/");
  }

  try {
    const updatedOwner = await Owner.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedOwner) {
      return res.status(404).json({ message: "Owner bulunamadı." });
    }

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
