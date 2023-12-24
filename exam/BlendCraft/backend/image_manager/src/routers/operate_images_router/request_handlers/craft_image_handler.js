import {v4} from "uuid";
import uploadFileToStorage from "../../../helpers/upload_file_to_storage.js";
import rabbitMQ_notification from "../../../helpers/connect_to_send.js";

const RABBITMQ_QUEUE_IMAGE_BG_REMOVER = process.env.RABBITMQ_QUEUE_IMAGE_BG_REMOVER;

const craftImageHandler = async (req, res) => {
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
      _id: v4(),
      photoName: name,
      userId: userId,
      createdAt: Date.now()
    };
    console.log("CRAFTED_IMAGE CREATED IN IMAGE_MANAGER", craftedImage);


    const photoFrontResponse = await uploadFileToStorage(craftedImage._id, {
      buffer: filePhotoFront.buffer,
      name: 'photo_front',
      type: filePhotoFront.mimetype
    });
    const photoBackgroundResponse = await uploadFileToStorage(craftedImage._id, {
      buffer: filePhotoBackground.buffer,
      name: 'photo_background',
      type: filePhotoBackground.mimetype
    });

    if (!photoFrontResponse.success || !photoBackgroundResponse.success) {
      console.error('Failed to upload one or more photos.');
      return res.status(500).json({ message: 'Failed to upload one or more photos.' });
    }


    craftedImage.photoFrontUrl = photoFrontResponse.data.photoUrl;
    craftedImage.photoBackgroundUrl = photoBackgroundResponse.data.photoUrl;


    console.log("CRAFTED_IMAGE AFTER IMAGE_MANAGER", craftedImage);
    await rabbitMQ_notification(RABBITMQ_QUEUE_IMAGE_BG_REMOVER, craftedImage);


    res.status(201).json({ message: 'Files uploaded successfully.', craftedImage: craftedImage });
  }
  catch (error) {
    console.error("IMAGE_MANAGER_ERROR", error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
}

export default craftImageHandler;