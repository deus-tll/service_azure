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
  console.error(message, error);

  await rabbitMQ_notification(RABBITMQ_QUEUE_NOTIFICATIONS, {
    name: RABBITMQ_QUEUE_ERROR_IMAGE_MIXER,
    data: { craftedImageId, message, error }
  });
};


const callbackForConsume = async (data, channel) => {
  let craftedImage = JSON.parse(data.content.toString());


  try {
    const load_photo_front_no_bg = await Jimp.read(craftedImage.photoFrontNoBgUrl);
    const load_photo_background = await Jimp.read(craftedImage.photoBackgroundUrl);

    const width = Math.max(load_photo_front_no_bg.getWidth(), load_photo_background.getWidth());
    const height = Math.max(load_photo_front_no_bg.getHeight(), load_photo_background.getHeight());

    const mergedImage = new Jimp(width, height);
    mergedImage.composite(load_photo_background, 0, 0);
    mergedImage.composite(load_photo_front_no_bg, 0, 0);

    const fileName = "photo_result_mix";
    const imageBuffer = await mergedImage.getBufferAsync('image/jpeg');
    const file = new File([imageBuffer], `${fileName}.jpeg`, { type: `image/jpeg` });

    const uploadResult = await uploadFileToStorage(craftedImage._id, file, fileName);

    if (uploadResult.success) {
      craftedImage.photoMixResultUrl = uploadResult.data.photoUrl;

      await Promise.all([
        rabbitMQ_notification(RABBITMQ_QUEUE_IMAGE_MANAGER, craftedImage),
        rabbitMQ_notification(RABBITMQ_QUEUE_NOTIFICATIONS, {
          name: RABBITMQ_QUEUE_SUCCESS_IMAGE_MIXER,
          data: {
            message: "Process of mixing images has been successfully completed.",
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