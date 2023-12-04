import amqp from "amqplib/callback_api.js";
import dotenv from 'dotenv';


dotenv.config();


const RABBITMQ_DEFAULT_USER = process.env.RABBITMQ_DEFAULT_USER || 'root';
const RABBITMQ_DEFAULT_PASS = process.env.RABBITMQ_DEFAULT_PASS || 'password';
const RABBITMQ_SERVER = process.env.RABBITMQ_SERVER || 'rabbit.mq';
const RABBITMQ_PORT = process.env.RABBITMQ_PORT || 5672;
const RABBITMQ_CONNECTION_URI = `amqp://${RABBITMQ_DEFAULT_USER}:${RABBITMQ_DEFAULT_PASS}@${RABBITMQ_SERVER}:${RABBITMQ_PORT}`;


const connectToRabbitMQ = async () => {
  return new Promise((resolve, reject) => {
    amqp.connect(RABBITMQ_CONNECTION_URI, {}, (errorConnect, connection) => {
      if (errorConnect) {
        reject(errorConnect);
        return;
      }

      console.debug("RabbitMQ Connection is ok.");
      resolve(connection);
    });
  });
};

const createRabbitMQChannel = async (connection) => {
  return new Promise((resolve, reject) => {
    connection.createChannel((errorChannel, channel) => {
      if (errorChannel) {
        reject(errorChannel);
        return;
      }

      resolve(channel);
    });
  });
};

const assertQueue = (channel, queueName) => {
  return new Promise((resolve, reject) => {
    channel.assertQueue(queueName, {}, (errorQueue) => {
      if (errorQueue) {
        reject(errorQueue);
        return;
      }

      console.debug(`\"${queueName}\" queue has been asserted.`);
      resolve();
    });
  });
};

const startConsuming = (channel, queueName, processCallback) => {
  return new Promise((resolve, reject) => {
    channel.consume(queueName,async (data) => {
      await processCallback(data, channel);
    });

    console.debug(`Started consuming messages from \"${queueName}\" queue.`);
    resolve();
  });
};

const connectToRabbitMQAndStartConsuming = async (queueName, processCallback) => {
  try {
    const connection = await connectToRabbitMQ();
    const channel = await createRabbitMQChannel(connection);

    await assertQueue(channel, queueName);
    await startConsuming(channel, queueName, processCallback);
  } catch (error) {
    console.error(error);
    process.exit(-1);
  }
};


export default connectToRabbitMQAndStartConsuming;