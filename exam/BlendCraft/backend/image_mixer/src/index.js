import dotenv from 'dotenv';
import uploadFileToStorage from "./helpers/upload_file_to_storage.js";
import rabbitMQ_notification from "./helpers/connect_to_send.js";
import connectToRabbitMQAndStartConsuming from "./helpers/connect_to_consume.js";
import Jimp from "jimp";


dotenv.config();


const { RABBITMQ_QUEUE_IMAGE_MANAGER, RABBITMQ_QUEUE_IMAGE_MIXER } = process.env;


const processMixingImages = async (data, channel) => {
  let craftedImage = JSON.parse(data.content.toString());

  Jimp.read(craftedImage.photoFrontNoBgUrl)
    .then(load_photo_front_no_bg => {
      Jimp.read(craftedImage.photoBackgroundUrl)
        .then(async (load_photo_background) => {

          const width = Math.max(load_photo_front_no_bg.getWidth(), load_photo_background.getWidth());
          const height = Math.max(load_photo_front_no_bg.getHeight(), load_photo_background.getHeight());

          const mergedImage = new Jimp(width, height);
          mergedImage.composite(load_photo_background, 0, 0);
          mergedImage.composite(load_photo_front_no_bg, 0, 0);

          const fileName = "photo_result_mix";
          const imageBuffer = await mergedImage.getBufferAsync('image/jpeg');
          const file = new File([imageBuffer], `${fileName}.jpeg`, { type: `image/jpeg` });

          const uploadResult = await uploadFileToStorage(craftedImage.id, file, fileName);

          if (uploadResult.success) {
            craftedImage.photoMixResultUrl = uploadResult.data.photoUrl;

            await rabbitMQ_notification(RABBITMQ_QUEUE_IMAGE_MANAGER, craftedImage);
          } else {
            // відправити на rabbitMQ помилку
          }
        })
        .catch(err => {
          console.error(err);
        });
    })
    .catch(err => {
      console.error(err);
    });

  console.log("CRAFTED IMAGE AFTER IMAGE_MIXER", craftedImage);
  channel.ack(data);
}


(async () => {
  await connectToRabbitMQAndStartConsuming(RABBITMQ_QUEUE_IMAGE_MIXER, processMixingImages);
})();