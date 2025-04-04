const path = require("path");
const fs = require("fs");
const Product = require("../models/Product");
const cloudinary = require("../utils/cloudinary");

// const createProduct = async (req, res) => {
//   console.log("Gelen Veriler:", req.body);
//   console.log("Yüklenen Dosyalar:", req.file);

//   try {
//     const { productName, productDesc, productPrice } = req.body;

//     // Yüklenen görselin yolunu al
//     // const productImage = req.file
//     //   ? `/uploads/products/${req.file.filename}`
//     //   : null;
//     const productImage = req.file?.path;

//     const newProduct = new Product({
//       productName,
//       productDesc,
//       productPrice,
//       productImage,
//     });

//     const savedProduct = await newProduct.save();
//     console.log("Kaydedilen Ürün:", savedProduct);

//     res.status(201).json(savedProduct);
//   } catch (error) {
//     console.error("Ürün Oluşturma Hatası:", error);
//     res.status(500).json({ message: "Ürün oluşturulurken bir hata oluştu." });
//   }
// };

// const updateProduct = async (req, res) => {
//   console.log("📩 Gelen Veriler:", req.body);
//   console.log("🖼️ Yüklenen Dosya:", req.file);

//   const { id } = req.params;
//   const { productName, productDesc, productPrice } = req.body;

//   const updateData = {
//     productName,
//     productDesc,
//     productPrice,
//   };

//   // Eğer yeni bir resim yüklenmişse, güncelle
//   // if (req.file) {
//   //   updateData.productImage = `/uploads/products/${req.file.filename}`;
//   // }
//   if (req.file?.path) updateData.productImage = req.file.path;

//   try {
//     const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
//       new: true,
//     });

//     if (!updatedProduct) {
//       return res.status(404).json({ message: "Ürün bulunamadı." });
//     }

//     res.status(200).json(updatedProduct);
//   } catch (error) {
//     console.error("🔥 Ürün güncellenirken hata:", error);
//     res.status(500).json({ message: "Ürün güncellenirken hata oluştu." });
//   }
// };
const createProduct = async (req, res) => {
  try {
    let imageUrl = "";

    // Eğer bir dosya yüklenmişse Cloudinary'ye gönder
    if (req.file) {
      const result = await cloudinary.uploader.upload_stream(
        { folder: "products" },
        async (error, result) => {
          if (error)
            return res.status(500).json({ error: "Dosya yükleme hatası" });

          imageUrl = result.secure_url; // Cloudinary'den dönen URL

          // Yeni ürünü oluştur
          const newProduct = new Product({
            name: req.body.name,
            price: req.body.price,
            productImage: imageUrl,
          });

          await newProduct.save();
          res.status(201).json(newProduct);
        }
      );

      result.end(req.file.buffer);
    } else {
      return res.status(400).json({ error: "Lütfen bir görsel yükleyin." });
    }
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası" });
  }
};
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Ürün bulunamadı" });

    let imageUrl = product.productImage; // Varsayılan olarak eski resmi kullan

    // Yeni resim yüklenmişse
    if (req.file) {
      // Cloudinary'ye yükle
      const result = await cloudinary.uploader.upload_stream(
        { folder: "products" },
        async (error, result) => {
          if (error)
            return res.status(500).json({ error: "Resim yükleme hatası" });

          // Cloudinary'deki eski resmi sil
          if (product.productImage) {
            const publicId = product.productImage
              .split("/")
              .pop()
              .split(".")[0];
            await cloudinary.uploader.destroy(`products/${publicId}`);
          }

          imageUrl = result.secure_url; // Yeni URL'yi al
          product.productImage = imageUrl;
          await product.save();
          res.status(200).json(product);
        }
      );

      result.end(req.file.buffer);
    } else {
      await product.save();
      res.status(200).json(product);
    }
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası" });
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
