import express from 'express';
import operateImagesRouter from './routers/operate_images_router/operate_images_router.js';
import connectToRabbitMQAndStartConsuming from "./helpers/connect_to_consume.js";
import callbackForConsume from "./helpers/callback_for_consume.js";


const app = express();
const port= 80;
const RABBITMQ_QUEUE_IMAGE_MANAGER = process.env.RABBITMQ_QUEUE_IMAGE_MANAGER;


app.use(express.json());
app.use('/api/image/manager', operateImagesRouter);


app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);

  await connectToRabbitMQAndStartConsuming(RABBITMQ_QUEUE_IMAGE_MANAGER, callbackForConsume);
});