const RABBITMQ_DEFAULT_USER = process.env.RABBITMQ_DEFAULT_USER;
const RABBITMQ_DEFAULT_PASS = process.env.RABBITMQ_DEFAULT_PASS;
const RABBITMQ_SERVER = process.env.RABBITMQ_SERVER;
const RABBITMQ_PORT = process.env.RABBITMQ_PORT;
const RABBITMQ_CONNECTION_URI = `amqp://${RABBITMQ_DEFAULT_USER}:${RABBITMQ_DEFAULT_PASS}@${RABBITMQ_SERVER}:${RABBITMQ_PORT}`;

const RABBITMQ_QUEUE_NOTIFICATIONS = process.env.RABBITMQ_QUEUE_NOTIFICATIONS;
const RABBITMQ_QUEUE_NOTIFICATIONS_AUTH_LOGIN = process.env.RABBITMQ_QUEUE_NOTIFICATIONS_AUTH_LOGIN;
const RABBITMQ_QUEUE_NOTIFICATIONS_AUTH_REGISTER = process.env.RABBITMQ_QUEUE_NOTIFICATIONS_AUTH_REGISTER;
const RABBITMQ_QUEUE_COMPUTER_VISION = process.env.RABBITMQ_QUEUE_COMPUTER_VISION;


import amqp from "amqplib/callback_api.js";
import socketEmitter from "./helpers/socket_emitter.js";



amqp.connect(RABBITMQ_CONNECTION_URI, {}, async (errorConnect, connection) => {
  if (errorConnect) {
    console.error(errorConnect);
    process.exit(-1);
  }

  console.debug("RabbitMQ Connection is ok");

  await connection.createChannel(async (errorChannel, channel) => {
    if (errorChannel) {
      console.error(errorChannel);
      process.exit(-1);
    }

    await channel.assertQueue(RABBITMQ_QUEUE_NOTIFICATIONS, {}, (errorQueue) => {
      if (errorQueue) {
        console.error(errorQueue);
        process.exit(-1);
      }

      console.debug(`${RABBITMQ_QUEUE_NOTIFICATIONS} queue has been asserted`);

      channel.consume(RABBITMQ_QUEUE_NOTIFICATIONS, async (data) => {
        let notification = JSON.parse(data.content.toString());

        console.debug(notification);

        switch (notification.name) {
          case RABBITMQ_QUEUE_NOTIFICATIONS_AUTH_LOGIN:
            socketEmitter(notification.name, notification.data);
            break;

          case RABBITMQ_QUEUE_NOTIFICATIONS_AUTH_REGISTER:
            socketEmitter(notification.name, notification.data);
            break;

          case RABBITMQ_QUEUE_COMPUTER_VISION:
            socketEmitter(notification.name, notification.data);
            break;
        }

        channel.ack(data);
      });
    })
  });
});