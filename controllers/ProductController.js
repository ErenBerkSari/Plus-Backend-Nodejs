const path = require("path");
const fs = require("fs");
const Product = require("../models/Product");
const cloudinary = require("../utils/cloudinary");

const createProduct = async (req, res) => {
  try {
    // Eğer bir dosya yüklenmişse Cloudinary'ye gönder
    if (req.file) {
      // Stream kullanarak Cloudinary'ye yükleme
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary yükleme hatası:", error);
              return reject(error);
            }
            resolve(result);
          }
        );

        // Buffer'ı stream'e aktar
        stream.end(req.file.buffer);
      });

      // Cloudinary yükleme işlemini bekle
      const result = await uploadPromise;

      // Yeni ürünü oluştur - Schema ile uyumlu alan isimleri kullan
      const newProduct = new Product({
        productName: req.body.productName,
        productDesc: req.body.productDesc,
        productPrice: req.body.productPrice,
        productImage: result.secure_url,
      });

      await newProduct.save();
      res.status(201).json(newProduct);
    } else {
      return res.status(400).json({ error: "Lütfen bir görsel yükleyin." });
    }
  } catch (error) {
    console.error("Ürün oluşturma hatası:", error);
    res.status(500).json({ error: "Sunucu hatası", details: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Ürün bulunamadı!" });
    }

    // Güncellenecek alanları hazırla - Schema ile uyumlu alan isimleri kullan
    let updatedFields = {
      productName: req.body.productName || product.productName,
      productDesc: req.body.productDesc || product.productDesc,
      productPrice: req.body.productPrice || product.productPrice,
    };

    // Eğer yeni bir resim yüklendiyse
    if (req.file) {
      // Eski resmi sil (eğer varsa)
      if (product.productImage) {
        try {
          // Cloudinary URL'sinden public_id çıkarma
          const publicId = product.productImage.split("/").pop().split(".")[0];
          const folder = product.productImage.split("/").slice(-2)[0];
          const fullPublicId = `${folder}/${publicId}`;

          await cloudinary.uploader.destroy(fullPublicId);
        } catch (deleteError) {
          console.error("Eski resim silinirken hata:", deleteError);
          // Eski resim silinirken hata olsa bile devam et
        }
      }

      // Yeni resmi Cloudinary'ye yükle
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      const result = await uploadPromise;
      updatedFields.productImage = result.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    return res.json(updatedProduct);
  } catch (error) {
    console.error("❌ Güncelleme hatası:", error);
    return res
      .status(500)
      .json({ error: "Sunucuda bir hata oluştu!", details: error.message });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const product = await Product.find();
    if (!product) {
      return res.status(404).json({ message: "Section product bulunamadı." });
    }
    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Section product getirilirken bir hata oluştu." });
  }
};
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Ürün bulunamadı." });
    }

    res.status(200).json({ message: "Ürün başarıyla silindi." });
  } catch (error) {
    console.error("Ürün silinirken hata:", error);
    res.status(500).json({ message: "Ürün silinirken hata oluştu." });
  }
};

module.exports = { updateProduct, deleteProduct };

module.exports = {
  getAllProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
