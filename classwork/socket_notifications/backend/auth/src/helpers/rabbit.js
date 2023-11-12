/**
 * Configure RabbitMQ server
 */
const RABBITMQ_DEFAULT_USER = process.env.RABBITMQ_DEFAULT_USER || 'root';
const RABBITMQ_DEFAULT_PASS = process.env.RABBITMQ_DEFAULT_PASS || 'password';
const RABBITMQ_SERVER = process.env.RABBITMQ_SERVER || 'rabbit.mq';
const RABBITMQ_QUEUE_AUTH = process.env.RABBITMQ_QUEUE_AUTH || 'auth';
const RABBITMQ_PORT = process.env.RABBITMQ_PORT || 5672;
const RABBITMQ_CONNECTION_URI = `amqp://${RABBITMQ_DEFAULT_USER}:${RABBITMQ_DEFAULT_PASS}@${RABBITMQ_SERVER}:${RABBITMQ_PORT}`;

const amqp = require ('amqplib/callback_api.js');

let connection;
let channel;
amqp.connect(RABBITMQ_CONNECTION_URI, {}, async (errorConnect, conn) => {
    if (errorConnect) {
        console.error(errorConnect);
        process.exit(-1);
    }

    connection = conn;
    console.debug("connect RabbitMQ ok");

    await connection.createChannel(async (errorChannel, ch) => {
        if (errorChannel) {
            console.error(errorChannel);
            process.exit(-1);
        }

        await ch.assertQueue(RABBITMQ_QUEUE_AUTH, {}, (errorEmailQueue) => {
            if (errorEmailQueue) {
                console.error(errorEmailQueue);
                process.exit(-1);
            }
            console.debug("Auth queue asserted");
        });

        channel = ch;
    });


});

module.exports = (eventName, eventData) => {
    let msg = {
        name: eventName,
        data: eventData
    }
    channel.sendToQueue (RABBITMQ_QUEUE_AUTH, Buffer.from(JSON.stringify(msg)));
};





