import {io} from "socket.io-client"
import {useEffect} from "react";



const SOCKET_SERVER = 'http://localhost:80';
const NOTIFY_SERVER_NAME = process.env.NOTIFY_SERVER_NAME || 'socket.serverName';
const NOTIFY_PING = process.env.NOTIFY_PING || 'socket.ping';
const RABBITMQ_QUEUE_NOTIFICATIONS_AUTH_LOGIN =
  process.env.RABBITMQ_QUEUE_NOTIFICATIONS_AUTH_LOGIN || 'notifications.auth.login';
const RABBITMQ_QUEUE_NOTIFICATIONS_AUTH_REGISTER =
  process.env.RABBITMQ_QUEUE_NOTIFICATIONS_AUTH_REGISTER || "notifications.auth.register";
const RABBITMQ_QUEUE_COMPUTER_VISION = process.env.RABBITMQ_QUEUE_COMPUTER_VISION || "ai.computer.vision";


const SocketConnection = ({onConnect, onDisconnect, onServerName, onPing, onUserLogin, onUserRegister, onComputerVision}) => {
  useEffect(() => {
    const socket = io(SOCKET_SERVER);

    socket.on(NOTIFY_SERVER_NAME, (data) => {
      onServerName(data);
    });

    socket.on(NOTIFY_PING, (data) => {
      onPing(data);
    });

    socket.on(RABBITMQ_QUEUE_NOTIFICATIONS_AUTH_LOGIN, (data) => {
      let user = JSON.parse(data);
      onUserLogin(user);
    });

    socket.on(RABBITMQ_QUEUE_NOTIFICATIONS_AUTH_REGISTER, (data) => {
      let user = JSON.parse(data);
      onUserRegister(user);
    });

    socket.on(RABBITMQ_QUEUE_COMPUTER_VISION, (data) => {
      let describingOfImage = JSON.parse(data);
      onComputerVision(describingOfImage);
    });

    socket.on('connect', () => {
      onConnect();
    });

    socket.on('disconnect', () => {
      onDisconnect();
    });

    return () => {
      socket.disconnect();
    };
  }, [onConnect, onDisconnect, onServerName, onPing, onUserLogin]);

  return null;
}

export default SocketConnection;