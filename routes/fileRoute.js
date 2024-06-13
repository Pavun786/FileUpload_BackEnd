const express = require("express");
const dotenv = require("dotenv")
const router = express.Router()
const {fileUpload,getAllFiles,fileEdit,deleteFile,getSingleFile} = require("../controllers/fileController");

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
dotenv.config();


cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'DEV',
    allowedFormats: ['png', 'jpg', 'jpeg'],
    transformation: [{ width: 250, height: 250, crop: 'fill' }]
  }
});

const upload = multer({ storage: storage });


router.post("/fileUpload", upload.single('file'),fileUpload);

router.get("/allFiles",getAllFiles)

router.get("/getSingleFile/:id",getSingleFile)

router.put("/editFile/:id",upload.single('file'),fileEdit)

router.delete("/deleteFile/:id",deleteFile)



module.exports = router;