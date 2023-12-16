import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";


const REDIS_SOCKET_HOST = process.env.REDIS_SOCKET_HOST;
const REDIS_SOCKET_PORT = process.env.REDIS_SOCKET_PORT;
const SERVER_PORT = process.env.SERVER_PORT || 80;
const REDIS_SOCKET_CONNECTION_STRING = `redis://${REDIS_SOCKET_HOST}:${REDIS_SOCKET_PORT}`;


const pubClient = createClient({
  url: REDIS_SOCKET_CONNECTION_STRING
});
const subClient = pubClient.duplicate();


pubClient.on('connect', () => {
  console.debug('Publish connection to Redis server has been established.');
});
subClient.on('connect', () => {
  console.debug('Subscribe connection to Redis server has been established.');
});


const io = new Server({
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));

  io.on('connection', (socket) => {
    console.debug(`connection: ${socket.handshake.address}`);

    socket.on('disconnect', data => {
      console.debug(`disconnect: ${socket.handshake.address}`, data);
    });
  });

  io.listen(Number(SERVER_PORT));
});