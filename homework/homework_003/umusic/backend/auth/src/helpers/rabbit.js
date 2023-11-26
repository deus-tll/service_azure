const RABBITMQ_DEFAULT_USER = process.env.RABBITMQ_DEFAULT_USER || 'root';
const RABBITMQ_DEFAULT_PASS = process.env.RABBITMQ_DEFAULT_PASS || 'password';
const RABBITMQ_SERVER = process.env.RABBITMQ_SERVER || 'rabbit.mq';
const RABBITMQ_PORT = process.env.RABBITMQ_PORT || 5672;
const RABBITMQ_CONNECTION_URI = `amqp://${RABBITMQ_DEFAULT_USER}:${RABBITMQ_DEFAULT_PASS}@${RABBITMQ_SERVER}:${RABBITMQ_PORT}`;

const RABBITMQ_QUEUE_NOTIFICATIONS = process.env.RABBITMQ_QUEUE_NOTIFICATIONS;



import amqp from "amqplib/callback_api.js";



let channel;

const connectToRabbitMQ = () => {
  return new Promise((resolve, reject) => {
    amqp.connect(RABBITMQ_CONNECTION_URI, {}, async (errorConnect, connection) => {
      if (errorConnect) {
        console.error(errorConnect);
        reject(errorConnect);
      }

      console.debug("RabbitMQ Connection is ok");

      await connection.createChannel(async (errorChannel, _channel) => {
        if (errorChannel) {
          console.error(errorChannel);
          reject(errorChannel);
        }

        await _channel.assertQueue(RABBITMQ_QUEUE_NOTIFICATIONS, {}, (errorQueue) => {
          if (errorQueue) {
            console.error(errorQueue);
            reject(errorQueue);
          }

          console.debug(`${RABBITMQ_QUEUE_NOTIFICATIONS} queue has been asserted`);
        });

        channel = _channel;
        resolve();
      });
    });
  });
};

const rabbitMQ_notification = async (eventName, eventData) => {
  try {
    if (!channel) {
      await connectToRabbitMQ();
    }

    let msg = {
      name: eventName,
      data: eventData
    };

    channel.sendToQueue(RABBITMQ_QUEUE_NOTIFICATIONS, Buffer.from(JSON.stringify(msg)));
  } catch (error) {
    console.error("Error in rabbitMQ_notification:", error);
    throw error;
  }
};

export default rabbitMQ_notification;