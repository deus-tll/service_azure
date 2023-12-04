import express from 'express';
import multer from 'multer';
import { uploadImage } from '../helpers/azure_storage';


const router = express.Router();
const upload = multer();


router.post('/upload_images', upload.single('file'), async(req, res) => {
  try {
    const craftedImageId = req.body.craftedImageId;
    const fileName = req.body.fileName
    const file = req.file;

    const uploadedImage = await uploadImage(craftedImageId, file, fileName);

    res.status(200).json({ message: 'Image uploaded successfully', uploadedImage: uploadedImage });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;