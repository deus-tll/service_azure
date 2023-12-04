import amqp from "amqplib/callback_api.js";
import dotenv from 'dotenv';


dotenv.config();


const RABBITMQ_DEFAULT_USER = process.env.RABBITMQ_DEFAULT_USER || 'root';
const RABBITMQ_DEFAULT_PASS = process.env.RABBITMQ_DEFAULT_PASS || 'password';
const RABBITMQ_SERVER = process.env.RABBITMQ_SERVER || 'rabbit.mq';
const RABBITMQ_PORT = process.env.RABBITMQ_PORT || 5672;
const RABBITMQ_CONNECTION_URI = `amqp://${RABBITMQ_DEFAULT_USER}:${RABBITMQ_DEFAULT_PASS}@${RABBITMQ_SERVER}:${RABBITMQ_PORT}`;

const RABBITMQ_QUEUE_IMAGE_BG_REMOVER = process.env.RABBITMQ_QUEUE_IMAGE_BG_REMOVER;


let channel;

const connectToRabbitMQ = () => {
  return new Promise((resolve, reject) => {
    amqp.connect(RABBITMQ_CONNECTION_URI, {}, async (errorConnect, connection) => {
      if (errorConnect) {
        console.error(errorConnect);
        reject(errorConnect);
      }

      console.debug("RabbitMQ Connection is ok.");

      await connection.createChannel(async (errorChannel, _channel) => {
        if (errorChannel) {
          console.error(errorChannel);
          reject(errorChannel);
        }

        await _channel.assertQueue(RABBITMQ_QUEUE_IMAGE_BG_REMOVER, {}, (errorQueue) => {
          if (errorQueue) {
            console.error(errorQueue);
            reject(errorQueue);
          }

          console.debug(`\"${RABBITMQ_QUEUE_IMAGE_BG_REMOVER}\" queue has been asserted to send.`);
        });

        channel = _channel;
        resolve();
      });
    });
  });
};


const rabbitMQ_notification = async (craftedImage) => {
  try {
    if (!channel) {
      await connectToRabbitMQ();
    }

    channel.sendToQueue(RABBITMQ_QUEUE_IMAGE_BG_REMOVER, Buffer.from(JSON.stringify(craftedImage)));
  } catch (error) {
    console.error("Error in rabbitMQ_notification:", error);
    throw error;
  }
};

export default rabbitMQ_notification;