import dotenv from 'dotenv';
import {removeBackground} from "./helpers/remove_bg.js";
import {uploadFileToStorage} from "./helpers/upload_file_to_storage.js";
import rabbitMQ_notification from "../../../notifications/notification_router/src/helpers/connect_to_send.js";
import connectToRabbitMQAndStartConsuming from "../../../notifications/notification_router/src/helpers/connect_to_consume.js";

dotenv.config();


const RABBITMQ_QUEUE_IMAGE_BG_REMOVER = process.env.RABBITMQ_QUEUE_IMAGE_BG_REMOVER;
const RABBITMQ_QUEUE_IMAGE_MIXER = process.env.RABBITMQ_QUEUE_IMAGE_MIXER;


const processRemovingBgFromImage = async (data, channel) => {
  let craftedImage = JSON.parse(data.content.toString());

  try {
    const records = await removeBackground(craftedImage.photoFrontUrl);

    console.log('Results:', records);

    if (records && records.length > 0) {
      const photoFrontUrlNoBg = records[0]._output_url;
      const uploadResult = await uploadFileToStorage(craftedImage.id, photoFrontUrlNoBg, "photo_front_no_background");

      if (uploadResult.success) {
        craftedImage.photoFrontUrlNoBg = uploadResult.data.photoUrl;
        craftedImage.bgRemovedAt = Date.now();

        await rabbitMQ_notification(RABBITMQ_QUEUE_IMAGE_MIXER, craftedImage);
      } else {
        // відправити на rabbitMQ помилку
      }
    } else {
      console.error('Error: Empty or invalid records received from removeBG API.');
    }
  } catch (error) {
    console.error('Error processing and uploading photo:', error);
  }

  console.log("CRAFTED IMAGE AFTER IMAGE_BG_REMOVER", craftedImage);
  channel.ack(data);
};


(async () => {
  await connectToRabbitMQAndStartConsuming(RABBITMQ_QUEUE_IMAGE_BG_REMOVER, processRemovingBgFromImage);
})();





















// 2 attempt
// const connectToRabbitMQ = async () => {
//   return new Promise((resolve, reject) => {
//     amqp.connect(RABBITMQ_CONNECTION_URI, {}, (errorConnect, connection) => {
//       if (errorConnect) {
//         reject(errorConnect);
//         return;
//       }
//
//       console.debug("RabbitMQ Connection is ok.");
//       resolve(connection);
//     });
//   });
// };
//
// const createRabbitMQChannel = async (connection) => {
//   return new Promise((resolve, reject) => {
//     connection.createChannel((errorChannel, channel) => {
//       if (errorChannel) {
//         reject(errorChannel);
//         return;
//       }
//
//       resolve(channel);
//     });
//   });
// };
//
// const assertQueue = (channel) => {
//   return new Promise((resolve, reject) => {
//     channel.assertQueue(RABBITMQ_QUEUE_IMAGE_BG_REMOVER, {}, (errorQueue) => {
//       if (errorQueue) {
//         reject(errorQueue);
//         return;
//       }
//
//       console.debug(`\"${RABBITMQ_QUEUE_IMAGE_BG_REMOVER}\" queue has been asserted.`);
//       resolve();
//     });
//   });
// };
//
// const startConsuming = (channel) => {
//   return new Promise((resolve, reject) => {
//     channel.consume(RABBITMQ_QUEUE_IMAGE_BG_REMOVER,async (data) => {
//       await processImage(data, channel);
//     });
//
//     console.debug(`Started consuming messages from \"${RABBITMQ_QUEUE_IMAGE_BG_REMOVER}\" queue.`);
//     resolve();
//   });
// };
//
//
//
// const connectToRabbitMQAndStartConsuming = async () => {
//   try {
//     const connection = await connectToRabbitMQ();
//     const channel = await createRabbitMQChannel(connection);
//
//     await assertQueue(channel);
//     await startConsuming(channel);
//   } catch (error) {
//     console.error(error);
//     process.exit(-1);
//   }
// };
//
// (async () => {
//   await connectToRabbitMQAndStartConsuming();
// })();




// 1 attempt
// amqp.connect(RABBITMQ_CONNECTION_URI, {}, async (errorConnect, connection) => {
//   if (errorConnect) {
//     console.error(errorConnect);
//     process.exit(-1);
//   }
//
//   console.debug("RabbitMQ Connection is ok.");
//
//   await connection.createChannel(async (errorChannel, channel) => {
//     if (errorChannel) {
//       console.error(errorChannel);
//       process.exit(-1);
//     }
//
//     await channel.assertQueue(RABBITMQ_QUEUE_IMAGE_BG_REMOVER, {}, (errorQueue) => {
//       if (errorQueue) {
//         console.error(errorQueue);
//         process.exit(-1);
//       }
//
//       console.debug(`\"${RABBITMQ_QUEUE_IMAGE_BG_REMOVER}\" queue has been asserted to consume.`);
//
//       channel.consume(RABBITMQ_QUEUE_IMAGE_BG_REMOVER, async (data) => {
//         let craftedImage = JSON.parse(data.content.toString());
//
//         removeBackground(craftedImage.photoFrontUrl)
//           .then(async (records) => {
//             console.log('Results:', records);
//             if (records && records.length > 0) {
//               const photoFrontUrlNoBg = records[0]._output_url;
//               const uploadResult = await uploadFileToStorage(craftedImage.id, photoFrontUrlNoBg, craftedImage.photoName);
//
//               if (uploadResult.success) {
//                 craftedImage.photoFrontUrlNoBg = uploadResult.data.photoUrl;
//                 craftedImage.bgRemovedAt = Date.now();
//
//                 // відправити на rabbitMQ результат
//               }
//               else {
//                 // відправити на rabbitMQ помилку
//               }
//             } else {
//               console.error('Error: Empty or invalid records received from removeBG API.');
//             }
//           })
//           .catch(error => {
//             console.error('Error processing and uploading photo:', error);
//           });
//
//         console.log("CRAFTED IMAGE AFTER IMAGE_BG_REMOVER", craftedImage);
//         channel.ack(data);
//       });
//     })
//   });
// });