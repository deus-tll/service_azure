import Jimp from "jimp";
import uploadFileToStorage from "./upload_file_to_storage.js";
import rabbitMQ_notification from "./connect_to_send.js";


const {
  RABBITMQ_QUEUE_NOTIFICATIONS,
  RABBITMQ_QUEUE_IMAGE_MANAGER,
  RABBITMQ_QUEUE_ERROR_IMAGE_MIXER,
  RABBITMQ_QUEUE_SUCCESS_IMAGE_MIXER
} = process.env;


const handleError = async (craftedImageId, message, error) => {
  console.error(`[${new Date().toISOString()}] ${message}`, error);

  await rabbitMQ_notification(RABBITMQ_QUEUE_NOTIFICATIONS, {
    name: RABBITMQ_QUEUE_ERROR_IMAGE_MIXER,
    data: { craftedImageId, message, error: error.message }
  });
};


const callbackForConsume = async (data, channel) => {
  let craftedImage = JSON.parse(data.content.toString());


  try {
    const loadPhotoFrontNoBg = await Jimp.read(craftedImage.photoFrontNoBgUrl);
    const loadPhotoBackground = await Jimp.read(craftedImage.photoBackgroundUrl);

    const width = Math.max(loadPhotoFrontNoBg.getWidth(), loadPhotoBackground.getWidth());
    const height = Math.max(loadPhotoFrontNoBg.getHeight(), loadPhotoBackground.getHeight());

    const mergedImage = new Jimp(width, height);
    mergedImage.composite(loadPhotoBackground, 0, 0);
    mergedImage.composite(loadPhotoFrontNoBg, 0, 0);

    const imageBuffer = await mergedImage.getBufferAsync('image/jpeg');

    const uploadResult = await uploadFileToStorage(craftedImage._id, {
      buffer: imageBuffer,
      name: "photo_result_mix",
      type: "image/jpeg"
    });

    if (uploadResult.success) {
      craftedImage.photoMixResultUrl = uploadResult.data.photoUrl;
      craftedImage.photosMixedAt = Date.now();

      await Promise.all([
        rabbitMQ_notification(RABBITMQ_QUEUE_IMAGE_MANAGER, craftedImage),
        rabbitMQ_notification(RABBITMQ_QUEUE_NOTIFICATIONS, {
          name: RABBITMQ_QUEUE_SUCCESS_IMAGE_MIXER,
          data: {
            message: "Process of mixing images has been successfully completed",
            craftedImage: craftedImage
          }
        })
      ]);
    } else {
      await handleError(craftedImage._id, uploadResult.message, uploadResult.error);
    }
  } catch (error) {
    const message = 'Error while mixing images.';
    await handleError(craftedImage._id, message, error);
  }

  console.log("CRAFTED IMAGE AFTER IMAGE_MIXER", craftedImage);
  channel.ack(data);
};

export default callbackForConsume;