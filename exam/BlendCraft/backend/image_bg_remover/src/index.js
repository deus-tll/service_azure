import dotenv from 'dotenv';
import {removeBackground} from "./helpers/remove_bg.js";
import uploadFileToStorage from "./helpers/upload_file_to_storage.js";
import rabbitMQ_notification from "./helpers/connect_to_send.js";
import connectToRabbitMQAndStartConsuming from "./helpers/connect_to_consume.js";
import {convertToFile} from "./helpers/convert_to_file.js";

dotenv.config();


const {
  RABBITMQ_QUEUE_NOTIFICATIONS,
  RABBITMQ_QUEUE_IMAGE_BG_REMOVER,
  RABBITMQ_QUEUE_IMAGE_MIXER,
  RABBITMQ_QUEUE_ERROR_IMAGE_BG_REMOVER
} = process.env;


const processRemovingBgFromImage = async (data, channel) => {
  let craftedImage = JSON.parse(data.content.toString());

  try {
    const records = await removeBackground(craftedImage.photoFrontUrl);

    console.log('Results:', records);

    if (records && records.length > 0) {
      const photoFrontNoBgUrl = records[0]._output_url;
      const photoFrontNoBgFile = convertToFile(photoFrontNoBgUrl, "photo_front_no_background", "png");
      const uploadResult = await uploadFileToStorage(craftedImage.id, photoFrontNoBgFile, "photo_front_no_background");

      if (uploadResult.success) {
        craftedImage.photoFrontNoBgUrl = uploadResult.data.photoUrl;
        craftedImage.bgRemovedAt = Date.now();

        await rabbitMQ_notification(RABBITMQ_QUEUE_IMAGE_MIXER, craftedImage);


      } else {
        await rabbitMQ_notification(RABBITMQ_QUEUE_NOTIFICATIONS, {
          name: RABBITMQ_QUEUE_ERROR_IMAGE_BG_REMOVER,
          data: {message: uploadResult.message, error: uploadResult.error }
        });
      }
    } else {
      const message = 'Empty or invalid records received from removeBG API.';

      console.error(message);

      await rabbitMQ_notification(RABBITMQ_QUEUE_NOTIFICATIONS, {
        name: RABBITMQ_QUEUE_ERROR_IMAGE_BG_REMOVER,
        data: {message: message, error: null }
      });
    }
  } catch (error) {
    const message = 'Error processing and uploading photo:'

    console.error(message, error);

    await rabbitMQ_notification(RABBITMQ_QUEUE_NOTIFICATIONS, {
      name: RABBITMQ_QUEUE_ERROR_IMAGE_BG_REMOVER,
      data: {message: message, error: error }
    });
  }

  console.log("CRAFTED IMAGE AFTER IMAGE_BG_REMOVER", craftedImage);
  channel.ack(data);
};


(async () => {
  await connectToRabbitMQAndStartConsuming(RABBITMQ_QUEUE_IMAGE_BG_REMOVER, processRemovingBgFromImage);
})();