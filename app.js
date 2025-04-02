const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");
const authRoute = require("./routes/authRoute");
const heroRoute = require("./routes/heroRoute");
const aboutRoute = require("./routes/aboutRoute");
const whyUsRoute = require("./routes/whyUsRoute");
const productRoute = require("./routes/productRoute");
const galleryRoute = require("./routes/galleryRoute");
const ownerRoute = require("./routes/ownerRoute");
const contactRoute = require("./routes/contactRoute");
const deleteUnusedFiles = require("./middlewares/deleteUnusedFiles");
dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Frontend'inizin çalıştığı port
    credentials: true, // Cookie'lerin gönderilmesine izin ver
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Connect DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB Connected Succesfuly");
  })
  .catch((err) => {
    console.log(err);
  });

deleteUnusedFiles();

app.use("/auth", authRoute);
app.use("/hero", heroRoute);
app.use("/about", aboutRoute);
app.use("/whyUs", whyUsRoute);
app.use("/product", productRoute);
app.use("/gallery", galleryRoute);
app.use("/owner", ownerRoute);
app.use("/contact", contactRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı.`);
});
