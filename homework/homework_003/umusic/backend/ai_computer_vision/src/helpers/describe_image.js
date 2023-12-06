import dotenv from 'dotenv';
import rabbitMQ_notification from "./connect_to_send.js";
import { ComputerVisionClient } from "@azure/cognitiveservices-computervision";
import { ApiKeyCredentials } from "@azure/ms-rest-js";


dotenv.config();


const KEY = process.env.COMPUTER_VISION_KEY;
const ENDPOINT = process.env.COMPUTER_VISION_ENDPOINT;
const RABBITMQ_QUEUE_NOTIFICATIONS = process.env.RABBITMQ_QUEUE_NOTIFICATIONS;
const RABBITMQ_QUEUE_COMPUTER_VISION = process.env.RABBITMQ_QUEUE_COMPUTER_VISION;

const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { "Ocp-Apim-Subscription-Key": KEY } }),
  ENDPOINT
);


const describeImage = (imageUrl) => {

  const result = {
    isSuccess: false,
    data: null
  };

  computerVisionClient.describeImage(imageUrl)
    .then(async (res) => {
      console.log(res);

      let msg = {
        name: RABBITMQ_QUEUE_COMPUTER_VISION,
        data: res
      }

      await rabbitMQ_notification(RABBITMQ_QUEUE_NOTIFICATIONS, msg);

      result.isSuccess = true;
      result.data = res;
    })
    .catch(err => {
      console.error(err);
    });

  return result;
}

export default describeImage;