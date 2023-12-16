import connectToRabbitMQAndStartConsuming from "./helpers/connect_to_consume.js";
import callbackForConsume from "./helpers/callback_for_consume.js";


const RABBITMQ_QUEUE_IMAGE_MIXER = process.env.RABBITMQ_QUEUE_IMAGE_MIXER;


(async () => {
  await connectToRabbitMQAndStartConsuming(RABBITMQ_QUEUE_IMAGE_MIXER, callbackForConsume);
})();