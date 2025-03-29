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

    // 📌 1️⃣ Veritabanındaki tüm kullanılan dosyaları al
    const products = await Product.find({}, "productImage");
    const owners = await Owner.find({}, "ownerImage");
    const heros = await Hero.find({}, "heroImage heroVideo");
    const abouts = await About.find({}, "aboutImage aboutVideo");
    const galleries = await Gallery.find({}, "imageUrl"); // Doğru alanı aldık

    const usedFiles = new Set();

    // 📌 2️⃣ Kullanılan dosyaların yolunu set'e ekle
    const addFileToSet = (filePath) => {
      if (filePath) {
        usedFiles.add(path.join(uploadsDir, filePath.replace("/uploads", "")));
      }
    };

    products.forEach((p) => addFileToSet(p.productImage));
    owners.forEach((o) => addFileToSet(o.ownerImage));
    abouts.forEach((a) => {
      addFileToSet(a.aboutImage);
      addFileToSet(a.aboutVideo);
    });
    heros.forEach((h) => {
      addFileToSet(h.heroImage);
      addFileToSet(h.heroVideo);
    });
    galleries.forEach((g) => addFileToSet(g.imageUrl));

    // 📌 3️⃣ uploads klasöründeki tüm dosyaları ve alt klasörleri tara
    const scanAndDelete = (dir) => {
      fs.readdirSync(dir).forEach((file) => {
        const filePath = path.join(dir, file);

        // Eğer klasörse içine gir
        if (fs.statSync(filePath).isDirectory()) {
          return scanAndDelete(filePath);
        }

        // Eğer dosya kullanılmıyorsa sil
        if (!usedFiles.has(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`✅ Silindi: ${filePath}`);
        }
      });
    };

    scanAndDelete(uploadsDir);
    console.log("✅ Kullanılmayan dosyalar temizlendi.");
  } catch (error) {
    console.error("🔥 Kullanılmayan dosyaları temizlerken hata:", error);
  }
};

// 🕒 1 saatte bir çalıştır
setInterval(deleteUnusedFiles, 1000 * 60 * 60);

module.exports = deleteUnusedFiles;
