import connectToRabbitMQAndStartConsuming from "./helpers/connect_to_consume.js";
import callbackForConsume from "./helpers/callback_for_consume.js";


const RABBITMQ_QUEUE_IMAGE_BG_REMOVER = process.env.RABBITMQ_QUEUE_IMAGE_BG_REMOVER;


(async () => {
  await connectToRabbitMQAndStartConsuming(RABBITMQ_QUEUE_IMAGE_BG_REMOVER, callbackForConsume);
})();