import {Emitter} from "@socket.io/redis-emitter";
import {createClient} from "redis";


const { REDIS_SOCKET_HOST , REDIS_SOCKET_PORT } = process.env;
const REDIS_SOCKET_CONNECTION_STRING = `redis://${REDIS_SOCKET_HOST}:${REDIS_SOCKET_PORT}`;


let io;

const redisClient = createClient({
  url: REDIS_SOCKET_CONNECTION_STRING
});

redisClient.on('connect', () => {
  console.debug('Connection to Redis server has been established.');
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