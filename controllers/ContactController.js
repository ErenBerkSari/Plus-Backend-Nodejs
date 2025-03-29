const path = require("path");
const fs = require("fs");
const Contact = require("../models/Contact");

const createContact = async (req, res) => {
  const { contactAddress, contactPhone, contactEmail, contactOpeningHours } =
    req.body;
  console.log("Gelen Veriler:", req.body); // Gelen verileri logla

  try {
    const newContact = new Contact({
      contactAddress,
      contactPhone,
      contactEmail,
      contactOpeningHours,
    });

    const savedContact = await newContact.save();
    console.log("Kaydedilen Contact:", savedContact);

    res.status(201).json(savedContact);
  } catch (error) {
    console.error("Contact Oluşturma Hatası:", error);
    res
      .status(500)
      .json({ message: "Contact oluşturulurken bir hata oluştu." });
  }
};
const getContact = async (req, res) => {
  const id = process.env.CONTACT;
  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: "Section contact bulunamadı." });
    }
    res.status(200).json(contact);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Section contact getirilirken bir hata oluştu." });
  }
};

const updateContact = async (req, res) => {
  const id = process.env.CONTACT;
  const { contactAddress, contactPhone, contactEmail, contactOpeningHours } =
    req.body;

  // Güncelleme objesi oluştur
  const updateData = {
    contactAddress: contactAddress || "",
    contactPhone: contactPhone || "",
    contactEmail: contactEmail || "",
    contactOpeningHours: contactOpeningHours || "",
  };

  console.log("Update data:", updateData);

  try {
    const updatedContact = await Contact.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedContact) {
      return res.status(404).json({ message: "Contact bölümü bulunamadı." });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    console.error("Güncelleme hatası:", error);
    res
      .status(500)
      .json({ message: "Contact bölümü güncellenirken hata oluştu." });
  }
};

module.exports = {
  getContact,
  createContact,
  updateContact,
};
