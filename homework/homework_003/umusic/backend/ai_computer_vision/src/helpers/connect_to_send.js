import amqp from "amqplib/callback_api.js";
import dotenv from 'dotenv';


dotenv.config();


const {
  RABBITMQ_DEFAULT_USER,
  RABBITMQ_DEFAULT_PASS,
  RABBITMQ_SERVER,
  RABBITMQ_PORT
} = process.env;

const RABBITMQ_CONNECTION_URI = `amqp://${RABBITMQ_DEFAULT_USER}:${RABBITMQ_DEFAULT_PASS}@${RABBITMQ_SERVER}:${RABBITMQ_PORT}`;


let channel;

const connectToRabbitMQ = (queue) => {
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

        await _channel.assertQueue(queue, {}, (errorQueue) => {
          if (errorQueue) {
            console.error(errorQueue);
            reject(errorQueue);
          }

          console.debug(`\"${queue}\" queue has been asserted to send.`);
        });

        channel = _channel;
        resolve();
      });
    });
  });
};


const rabbitMQ_notification = async (queue, data) => {
  try {
    if (!channel) {
      await connectToRabbitMQ(queue);
    }

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
  } catch (error) {
    console.error("Error in rabbitMQ_notification:", error);
    throw error;
  }
};

export default rabbitMQ_notification;