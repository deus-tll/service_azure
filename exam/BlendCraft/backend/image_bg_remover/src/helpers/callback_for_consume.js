import removeBackground from "./remove_bg.js";
import convertToPngFileBuffer from "./convert_to_png_file_buffer.js";
import uploadFileToStorage from "./upload_file_to_storage.js";
import rabbitMQ_notification from "./connect_to_send.js";


const {
  RABBITMQ_QUEUE_NOTIFICATIONS,
  RABBITMQ_QUEUE_IMAGE_MIXER,
  RABBITMQ_QUEUE_ERROR_IMAGE_BG_REMOVER,
  RABBITMQ_QUEUE_SUCCESS_IMAGE_BG_REMOVER
} = process.env;


const handleError = async (craftedImageId, message, error) => {
  console.error(`[${new Date().toISOString()}] ${message}`, error);

  await rabbitMQ_notification(RABBITMQ_QUEUE_NOTIFICATIONS, {
    name: RABBITMQ_QUEUE_ERROR_IMAGE_BG_REMOVER,
    data: { craftedImageId, message, error: error.message }
  });
};


const callbackForConsume = async (data, channel) => {
  let craftedImage = JSON.parse(data.content.toString());

  try {
    const records = await removeBackground(craftedImage.photoFrontUrl);
    console.log('Results:', records);

    if (records && records.length > 0) {
      const photoFrontNoBgUrl = records[0]._output_url;
      const fileType = "image/png";
      const photoFrontNoBgFileBuffer = await convertToPngFileBuffer(photoFrontNoBgUrl);

      const uploadResult = await uploadFileToStorage(craftedImage._id, {
        buffer: photoFrontNoBgFileBuffer,
        name: "photo_front_no_background",
        type: fileType
      });

      if (uploadResult.success) {
        craftedImage.photoFrontNoBgUrl = uploadResult.data.photoUrl;
        craftedImage.bgRemovedAt = Date.now();

        console.log("CRAFTED_IMAGE AFTER IMAGE_BG_REMOVER", craftedImage);
        await Promise.all([
          rabbitMQ_notification(RABBITMQ_QUEUE_IMAGE_MIXER, craftedImage),
          rabbitMQ_notification(RABBITMQ_QUEUE_NOTIFICATIONS, {
            name: RABBITMQ_QUEUE_SUCCESS_IMAGE_BG_REMOVER,
            data: {
              message: "Process of removing background has been successfully completed",
              craftedImage: craftedImage
            }
          })
        ]);
      } else {
        await handleError(craftedImage._id, uploadResult.message, uploadResult.error);
      }
    } else {
      const message = 'Empty or invalid records received from removeBG API.';
      await handleError(craftedImage._id, message, {});
    }
  } catch (error) {
    const message = 'Error processing and uploading photo while removing background.';
    await handleError(craftedImage._id, message, error);
  }

  console.log("CRAFTED IMAGE AFTER IMAGE_BG_REMOVER", craftedImage);
  channel.ack(data);
};

export default callbackForConsume;