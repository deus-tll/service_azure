import rabbitMQ_notification from "./connect_to_send.js";
import axios from "axios";

const {
  RABBITMQ_QUEUE_NOTIFICATIONS,
  RABBITMQ_QUEUE_IMAGE_CRAFTING_FINISHED,
  RABBITMQ_QUEUE_ERROR_IMAGE_MANAGER
} = process.env;
const axiosDatabase = axios.create({
  baseURL: 'http://api.database.manager',
});

const handleError = async (craftedImageId, message, error) => {
  console.error(message, error);

  await rabbitMQ_notification(RABBITMQ_QUEUE_NOTIFICATIONS, {
    name: RABBITMQ_QUEUE_ERROR_IMAGE_MANAGER,
    data: { craftedImageId, message, error }
  });
};


const callbackForConsume = async (data, channel) => {
  let craftedImage = JSON.parse(data.content.toString());
  craftedImage.photoFinishedAt = Date.now();

  try {
    const response = await axiosDatabase.post(`/api/database/manager/save_crafted_image`, craftedImage);
    console.log('The CraftedImage is successfully saved in the database.');

    await rabbitMQ_notification(RABBITMQ_QUEUE_NOTIFICATIONS, {
      name: RABBITMQ_QUEUE_IMAGE_CRAFTING_FINISHED,
      data: {
        message: "Process of image crafting has been successfully finished.",
        craftedImage: craftedImage
      }
    });

  } catch (error) {
    const message = 'Error saving CraftedImage in the database.';
    await handleError(craftedImage._id, message, error);
  }

  channel.ack(data);
};

export default callbackForConsume;