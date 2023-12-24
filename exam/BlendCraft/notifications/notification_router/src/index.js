import connectToRabbitMQAndStartConsuming from "./helpers/connect_to_consume.js";
import callbackForConsume from "./helpers/callback_for_consume.js";


const {
  RABBITMQ_QUEUE_NOTIFICATIONS
} = process.env;


(async () => {
  await connectToRabbitMQAndStartConsuming(RABBITMQ_QUEUE_NOTIFICATIONS, callbackForConsume);
})();
