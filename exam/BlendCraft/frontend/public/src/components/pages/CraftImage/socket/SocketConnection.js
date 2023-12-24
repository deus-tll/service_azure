import {io} from "socket.io-client"
import {useEffect, useState} from "react";
import socketEventTypes from "./socketEventTypes";

const SOCKET_SERVER = 'http://localhost:80';

const handleConnect = () => {
  console.log('Connected to server');
};

const handleDisconnect = () => {
  console.log('Disconnected from server');
};

const SocketConnection = ({ craftedImageId, setSuccessImageBgRemoverMessage, setSuccessImageMixerMessage, setImageCraftingFinishedMessage, setErrorMessage, updateCraftedImage, setErrorCraftingImage }) => {
  const [socket, setSocket] = useState(null)

  const handleSuccessImageBgRemover = (data) => {
    const parsedData = JSON.parse(data);
    if (parsedData) {
      setSuccessImageBgRemoverMessage(parsedData.message);
      updateCraftedImage(parsedData.craftedImage);
      console.log(parsedData);
    }
  };

  const handleSuccessImageMixer = (data) => {
    const parsedData = JSON.parse(data);
    if (parsedData) {
      setSuccessImageMixerMessage(parsedData.message);
      updateCraftedImage(parsedData.craftedImage);
      console.log(parsedData);
    }

  };

  const handleImageCraftingFinished = (data) => {
    const parsedData = JSON.parse(data);
    if (parsedData) {
      setImageCraftingFinishedMessage(parsedData.message)
      updateCraftedImage(parsedData.craftedImage, false);
      console.log(parsedData);
    }
  };

  const handleError = (data) => {
    const parsedData = JSON.parse(data);
    if (parsedData) {
      setErrorMessage(parsedData.message);
      setErrorCraftingImage(parsedData.error);
      console.log(parsedData);
    }
  };

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER);
    setSocket(newSocket);

    return () => {
      newSocket?.disconnect();
    };
  }, []);

  useEffect(() => {
    socket?.on('connect', handleConnect);
    socket?.on('disconnect', handleDisconnect);
    socket?.on(`${socketEventTypes.RABBITMQ_QUEUE_SUCCESS_IMAGE_BG_REMOVER}.${craftedImageId}`, handleSuccessImageBgRemover);
    socket?.on(`${socketEventTypes.RABBITMQ_QUEUE_SUCCESS_IMAGE_MIXER}.${craftedImageId}`, handleSuccessImageMixer);
    socket?.on(`${socketEventTypes.RABBITMQ_QUEUE_ERROR_IMAGE_MANAGER}.${craftedImageId}`, handleError);
    socket?.on(`${socketEventTypes.RABBITMQ_QUEUE_ERROR_IMAGE_BG_REMOVER}.${craftedImageId}`, handleError);
    socket?.on(`${socketEventTypes.RABBITMQ_QUEUE_ERROR_IMAGE_MIXER}.${craftedImageId}`, handleError);
    socket?.on(`${socketEventTypes.RABBITMQ_QUEUE_IMAGE_CRAFTING_FINISHED}.${craftedImageId}`, handleImageCraftingFinished);

    return () => {
      socket?.off('connect', handleConnect);
      socket?.off('disconnect', handleDisconnect);
      socket?.off(`${socketEventTypes.RABBITMQ_QUEUE_SUCCESS_IMAGE_BG_REMOVER}.${craftedImageId}`, handleSuccessImageBgRemover);
      socket?.off(`${socketEventTypes.RABBITMQ_QUEUE_SUCCESS_IMAGE_MIXER}.${craftedImageId}`, handleSuccessImageMixer);
      socket?.off(`${socketEventTypes.RABBITMQ_QUEUE_ERROR_IMAGE_MANAGER}.${craftedImageId}`, handleError);
      socket?.off(`${socketEventTypes.RABBITMQ_QUEUE_ERROR_IMAGE_BG_REMOVER}.${craftedImageId}`, handleError);
      socket?.off(`${socketEventTypes.RABBITMQ_QUEUE_ERROR_IMAGE_MIXER}.${craftedImageId}`, handleError);
      socket?.off(`${socketEventTypes.RABBITMQ_QUEUE_IMAGE_CRAFTING_FINISHED}.${craftedImageId}`, handleImageCraftingFinished);

      socket?.disconnect();
    };
  }, [craftedImageId, socket]);

  return null;
};

export default SocketConnection;