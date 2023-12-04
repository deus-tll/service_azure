import dotenv from 'dotenv';
import rabbitMQ_notification from "../../../notifications/notification_router/src/helpers/connect_to_send.js"
import connectToRabbitMQAndStartConsuming from "../../../notifications/notification_router/src/helpers/connect_to_consume.js"
import Jimp from "jimp";


dotenv.config();


const RABBITMQ_QUEUE_IMAGE_MANAGER = process.env.RABBITMQ_QUEUE_IMAGE_MANAGER;
const RABBITMQ_QUEUE_IMAGE_MIXER = process.env.RABBITMQ_QUEUE_IMAGE_MIXER;



const processMixingImages = async (data, channel) => {
  let craftedImage = JSON.parse(data.content.toString());

  Jimp.read(craftedImage.photoFrontUrlNoBg)
    .then(load_photo_front_no_bg => {
      Jimp.read(craftedImage.photoBackgroundUrl)
        .then(async (load_photo_background) => {

          const width = Math.max(load_photo_front_no_bg.getWidth(), load_photo_background.getWidth());
          const height = Math.max(load_photo_front_no_bg.getHeight(), load_photo_background.getHeight());

          const mergedImage = new Jimp(width, height);

          mergedImage.composite(load_photo_background, 0, 0);
          mergedImage.composite(load_photo_front_no_bg, 0, 0);


          // реалізувати збереження у сховище

          const imageBuffer = await mergedImage.getBufferAsync('image/jpeg');


          await rabbitMQ_notification(RABBITMQ_QUEUE_IMAGE_MANAGER, craftedImage)
          // Далее пойдет сообщение
        })
        .catch(err => {
          console.error(err);
        });
    })
    .catch(err => {
      console.error(err);
    });
}



(async () => {
  await connectToRabbitMQAndStartConsuming(RABBITMQ_QUEUE_IMAGE_MIXER, processMixingImages);
})();