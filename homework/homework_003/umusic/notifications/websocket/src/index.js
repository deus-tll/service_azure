const REDIS_SOCKET_HOST = process.env.REDIS_SOCKET_HOST || 'redis.sockets';
const REDIS_SOCKET_PORT = process.env.REDIS_SOCKET_PORT || 6379;
const SERVER_NAME = process.env.SERVER_NAME || 'Node Socket';
const SERVER_PORT = process.env.SERVER_PORT || 80;
const NOTIFY_SERVER_NAME = process.env.NOTIFY_SERVER_NAME;
const NOTIFY_PING = process.env.NOTIFY_PING;
const REDIS_SOCKET_CONNECTION_STRING = `redis://${REDIS_SOCKET_HOST}:${REDIS_SOCKET_PORT}`;



import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";



const pubClient = createClient({
  url: REDIS_SOCKET_CONNECTION_STRING
});
const subClient = pubClient.duplicate();



pubClient.on('connect', () => {
  console.debug('Publish connection to Redis server is ok');
});
subClient.on('connect', () => {
  console.debug('Subscribe connection to Redis server is ok');
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
    socket.emit(NOTIFY_SERVER_NAME, SERVER_NAME);
    console.debug(`connection: ${socket.handshake.address}`);

    socket.on('disconnect', data => {
      console.debug(`disconnect: ${socket.handshake.address}`, data);
    });
  });

  io.listen(Number(SERVER_PORT));
});

setInterval(() => {
  io.emit(NOTIFY_PING, Date.now());
  console.debug("Ping Send at " + Date.now());
}, 10000)