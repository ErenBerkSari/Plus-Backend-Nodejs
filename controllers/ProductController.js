const path = require("path");
const fs = require("fs");
const Product = require("../models/Product");

const createProduct = async (req, res) => {
  console.log("Gelen Veriler:", req.body);
  console.log("Yüklenen Dosyalar:", req.file);

  try {
    const { productName, productDesc, productPrice } = req.body;

    // Yüklenen görselin yolunu al
    const productImage = req.file
      ? `/uploads/products/${req.file.filename}`
      : null;

    const newProduct = new Product({
      productName,
      productDesc,
      productPrice,
      productImage,
    });

    const savedProduct = await newProduct.save();
    console.log("Kaydedilen Ürün:", savedProduct);

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Ürün Oluşturma Hatası:", error);
    res.status(500).json({ message: "Ürün oluşturulurken bir hata oluştu." });
  }
};

const updateProduct = async (req, res) => {
  console.log("📩 Gelen Veriler:", req.body);
  console.log("🖼️ Yüklenen Dosya:", req.file);

  const { id } = req.params;
  const { productName, productDesc, productPrice } = req.body;

  const updateData = {
    productName,
    productDesc,
    productPrice,
  };

  // Eğer yeni bir resim yüklenmişse, güncelle
  if (req.file) {
    updateData.productImage = `/uploads/products/${req.file.filename}`;
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Ürün bulunamadı." });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("🔥 Ürün güncellenirken hata:", error);
    res.status(500).json({ message: "Ürün güncellenirken hata oluştu." });
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
