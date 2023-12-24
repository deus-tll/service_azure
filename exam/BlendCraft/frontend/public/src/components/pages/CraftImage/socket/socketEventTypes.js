const socketEventTypes = {
  RABBITMQ_QUEUE_IMAGE_CRAFTING_FINISHED: 'image.crafting.finished',
  RABBITMQ_QUEUE_ERROR_IMAGE_MANAGER: 'error.image.manager',
  RABBITMQ_QUEUE_ERROR_IMAGE_BG_REMOVER: 'error.image.bg.remover',
  RABBITMQ_QUEUE_ERROR_IMAGE_MIXER: 'error.image.mixer',
  RABBITMQ_QUEUE_SUCCESS_IMAGE_BG_REMOVER: 'success.image.bg.remover',
  RABBITMQ_QUEUE_SUCCESS_IMAGE_MIXER: 'success.image.mixer'
};

export default socketEventTypes;