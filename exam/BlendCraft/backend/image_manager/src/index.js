import express from 'express';
import dotenv from 'dotenv';
import craftImageRouter from './routers/craft_image_router.js';
import rabbitMQ_notification from "./helpers/connect_to_send.js";
import connectToRabbitMQAndStartConsuming from "./helpers/connect_to_consume.js";

dotenv.config();


const app = express();
const port= 80;
const RABBITMQ_QUEUE_IMAGE_MANAGER = process.env.RABBITMQ_QUEUE_IMAGE_MANAGER;
const RABBITMQ_QUEUE_NOTIFICATIONS = process.env.RABBITMQ_QUEUE_NOTIFICATIONS;
const RABBITMQ_QUEUE_IMAGE_CRAFTING_FINISHED = process.env.RABBITMQ_QUEUE_IMAGE_CRAFTING_FINISHED;

app.use(express.json());

app.use('/api/image/manager', craftImageRouter);


app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);

  const processFinishing = async (data, channel) => {
    let craftedImage = JSON.parse(data.content.toString());
    craftedImage.photoFinishedAt = Date.now();

    await rabbitMQ_notification(RABBITMQ_QUEUE_NOTIFICATIONS, {name: RABBITMQ_QUEUE_IMAGE_CRAFTING_FINISHED, data: {craftedImage: craftedImage}});

    channel.ack(data);
  };

  await connectToRabbitMQAndStartConsuming(RABBITMQ_QUEUE_IMAGE_MANAGER, processFinishing);
});