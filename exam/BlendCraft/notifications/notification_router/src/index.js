import dotenv from 'dotenv';
import connectToRabbitMQAndStartConsuming from "./helpers/connect_to_consume.js";
import socketEmitter from "./helpers/socket_emitter.js";


dotenv.config();

const { RABBITMQ_QUEUE_NOTIFICATIONS, RABBITMQ_QUEUE_IMAGE_CRAFTING_FINISHED } = process.env;


const processMessaging = (data, channel) => {
  let notification = JSON.parse(data.content.toString());


  console.debug(notification);

  switch (notification.name) {
    case RABBITMQ_QUEUE_IMAGE_CRAFTING_FINISHED:
      let craftedImage = notification.data.craftedImage;

      socketEmitter(`${notification.name}.${craftedImage.id}`, {
        message: "Process of image crafting has finished.",
        craftedImage: craftedImage
      });

      break;
  }

  channel.ack(data);
};


(async () => {
  await connectToRabbitMQAndStartConsuming(RABBITMQ_QUEUE_NOTIFICATIONS, processMessaging);
})();
