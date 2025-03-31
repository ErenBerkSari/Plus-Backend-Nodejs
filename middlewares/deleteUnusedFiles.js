const fs = require("fs");
const path = require("path");
const Product = require("../models/Product");
const Owner = require("../models/Owner");
const About = require("../models/About");
const Gallery = require("../models/Gallery");
const Hero = require("../models/Hero");

const uploadsDir = path.join(__dirname, "../uploads");

const deleteUnusedFiles = async () => {
  try {
    console.log("🗑️ Kullanılmayan dosyalar temizleniyor...");

    const usedFiles = new Set();

    // 📌 Kullanılan dosyaları veritabanından alıp set'e ekleyen fonksiyon
    const fetchFiles = async (model, fields) => {
      try {
        const records = await model.find({}, fields.join(" "));
        records.forEach((record) => {
          fields.forEach((field) => {
            if (record[field]) {
              usedFiles.add(
                path.join(uploadsDir, record[field].replace("/uploads", ""))
              );
            }
          });
        });
      } catch (err) {
        console.error(
          `❌ ${model.modelName} modelinden dosyalar alınırken hata oluştu:`,
          err
        );
      }
    };

    // 📌 Veritabanındaki tüm dosyaları al
    await Promise.all([
      fetchFiles(Product, ["productImage"]),
      fetchFiles(Owner, ["ownerImage"]),
      fetchFiles(About, ["aboutImage", "aboutVideo"]),
      fetchFiles(Hero, ["heroImage", "heroVideo"]),
      fetchFiles(Gallery, ["imageUrl"]),
    ]);

    // 📌 uploads klasörünü tara ve kullanılmayan dosyaları sil
    const scanAndDelete = (dir) => {
      try {
        fs.readdirSync(dir).forEach((file) => {
          const filePath = path.join(dir, file);

          if (fs.statSync(filePath).isDirectory()) {
            return scanAndDelete(filePath);
          }

          if (!usedFiles.has(filePath) && fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(`❌ Silinemedi: ${filePath}`, err);
              } else {
                console.log(`✅ Silindi: ${filePath}`);
              }
            });
          }
        });
      } catch (err) {
        console.error("❌ Dosya tarama/silme sırasında hata oluştu:", err);
      }
    };

    scanAndDelete(uploadsDir);
    console.log("✅ Kullanılmayan dosyalar temizlendi.");
  } catch (error) {
    console.error("🔥 Kullanılmayan dosyaları temizlerken genel hata:", error);
  }
};

setInterval(deleteUnusedFiles, 1000 * 60 * 60);

module.exports = deleteUnusedFiles;
