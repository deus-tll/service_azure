import socketEmitter from "./socket_emitter.js";

const {
  RABBITMQ_QUEUE_NOTIFICATIONS,
  RABBITMQ_QUEUE_IMAGE_CRAFTING_FINISHED,
  RABBITMQ_QUEUE_ERROR_IMAGE_BG_REMOVER,
  RABBITMQ_QUEUE_SUCCESS_IMAGE_BG_REMOVER,
  RABBITMQ_QUEUE_ERROR_IMAGE_MIXER,
  RABBITMQ_QUEUE_SUCCESS_IMAGE_MIXER,
  RABBITMQ_QUEUE_ERROR_IMAGE_MANAGER
} = process.env;

const callbackForConsume = (data, channel) => {
  let notification = JSON.parse(data.content.toString());

  console.debug(notification);

  switch (notification.name) {
    case RABBITMQ_QUEUE_IMAGE_CRAFTING_FINISHED:
      socketEmitter(`${notification.name}.${notification.data.craftedImage._id}`, notification.data);
      break;

    case RABBITMQ_QUEUE_SUCCESS_IMAGE_BG_REMOVER:
      socketEmitter(`${notification.name}.${notification.data.craftedImage._id}`, notification.data);
      break;

    case RABBITMQ_QUEUE_ERROR_IMAGE_BG_REMOVER:
      socketEmitter(`${notification.name}.${notification.data.craftedImageId}`, notification.data);
      break;

    case RABBITMQ_QUEUE_SUCCESS_IMAGE_MIXER:
      socketEmitter(`${notification.name}.${notification.data.craftedImage._id}`, notification.data);
      break;

    case RABBITMQ_QUEUE_ERROR_IMAGE_MIXER:
      socketEmitter(`${notification.name}.${notification.data.craftedImageId}`, notification.data);
      break;

    case RABBITMQ_QUEUE_ERROR_IMAGE_MANAGER:
      socketEmitter(`${notification.name}.${notification.data.craftedImageId}`, notification.data);
      break;
  }

  channel.ack(data);
};

export default callbackForConsume;