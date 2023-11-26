const REDIS_SOCKET_HOST = process.env.REDIS_SOCKET_HOST;
const REDIS_SOCKET_PORT = process.env.REDIS_SOCKET_PORT;
const REDIS_SOCKET_CONNECTION_STRING = `redis://${REDIS_SOCKET_HOST}:${REDIS_SOCKET_PORT}`;



import {Emitter} from "@socket.io/redis-emitter";
import {createClient} from "redis";



let io;

const redisClient = createClient({
  url: REDIS_SOCKET_CONNECTION_STRING
});

redisClient.on('connect', () => {
  console.debug('Connection to Redis server is ok');
});

redisClient.connect().then(() => {
  io = new Emitter(redisClient);
}).catch((err) => {
  console.error(err);
  process.exit(-1);
});

export default (eventName, eventData) => {
  io.emit(eventName, JSON.stringify(eventData));
};