const fs = require("fs");
const path = require("path");
const Product = require("../models/Product");
const Owner = require("../models/Owner");
const About = require("../models/About");
const Gallery = require("../models/Gallery");
const Hero = require("../models/Hero");

const uploadsDir = path.join(__dirname, "../uploads");

// 📌 Kullanılmayan dosyaları temizleyen fonksiyon
const deleteUnusedFiles = async () => {
  try {
    console.log("🗑️ Kullanılmayan dosyalar temizleniyor...");

    // ✅ Kullanılan dosyaları takip etmek için Set kullan
    const usedFiles = new Set();

    // 📌 Kullanılan dosyaları veritabanından alıp set'e ekleyen fonksiyon
    const fetchFiles = async (model, fields) => {
      try {
        const records = await model.find({}, fields.join(" "));
        records.forEach((record) => {
          fields.forEach((field) => {
            if (record[field]) {
              const filePath = path.join(
                uploadsDir,
                path.basename(record[field])
              );
              usedFiles.add(filePath);
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
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
          console.log("📂 'uploads' klasörü oluşturuldu.");
          return;
        }

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

// 📌 Her saat başı kullanılmayan dosyaları temizle
setInterval(deleteUnusedFiles, 1000 * 60 * 60);

module.exports = deleteUnusedFiles;
