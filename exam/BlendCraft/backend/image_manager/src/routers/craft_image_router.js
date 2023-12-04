import express from 'express';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import {v4} from 'uuid';
import dotenv from 'dotenv';
import {uploadFileToStorage} from "../helpers/upload_file_to_storage.js";
import rabbitMQ_notification from "../../../../notifications/notification_router/src/helpers/connect_to_send.js";


dotenv.config();


const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const RABBITMQ_QUEUE_IMAGE_BG_REMOVER = process.env.RABBITMQ_QUEUE_IMAGE_BG_REMOVER;


function getUserIdFromToken(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userId = decodedToken.user.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}


router.post('/craft_image', getUserIdFromToken, upload.fields([
  { name: 'filePhotoFront', maxCount: 1 },
  { name: 'filePhotoBackground', maxCount: 1 }
]), async (req, res) => {
  try {
    const userId = req.userId;
    const { name } = req.body;


    if (!userId || !name) {
      console.error('User ID and name are required.');
      return res.status(400).json({ message: 'User ID and name are required.' });
    }


    const filePhotoFront = req.files['filePhotoFront'] && req.files['filePhotoFront'][0];
    const filePhotoBackground = req.files['filePhotoBackground'] && req.files['filePhotoBackground'][0];

    if (!filePhotoFront || !filePhotoBackground) {
      console.error('Both front and background photos are required.');
      return res.status(400).json({ message: 'Both front and background photos are required.' });
    }


    const craftedImage = {
      id: v4(),
      photoName: name,
      userId: userId,
      createdAt: Date.now()
    };


    const photoFrontResponse = await uploadFileToStorage(craftedImage.id, filePhotoFront, 'photo_front');
    const photoBackgroundResponse = await uploadFileToStorage(craftedImage.id, filePhotoBackground, 'photo_background');

    if (!photoFrontResponse || !photoBackgroundResponse) {
      console.error('Failed to upload one or more photos.');
      return res.status(500).json({ message: 'Failed to upload one or more photos.' });
    }

    craftedImage.photoFrontUrl = photoFrontResponse.data.photoUrl;
    craftedImage.photoBackgroundUrl = photoBackgroundResponse.data.photoUrl;


    console.log("CRAFTED IMAGE AFTER IMAGE_MANAGER", craftedImage);


    await rabbitMQ_notification(RABBITMQ_QUEUE_IMAGE_BG_REMOVER, craftedImage);

    // користувач повинен знати id об'єкту результату
    // фронту потрібно мати два посилання на завантажені зображення
    res.status(201).json({ message: 'Files uploaded successfully.', craftedImage: craftedImage });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
});

export default router;