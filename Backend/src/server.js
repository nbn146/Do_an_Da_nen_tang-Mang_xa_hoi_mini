import { createServer } from "node:http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { initSocket } from "./services/socketService.js";

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: [env.clientWeb, env.clientMobile],
  },
});

initSocket(io);

async function bootstrap() {
  await connectDB();

  httpServer.listen(env.port, () => {
    console.log(`Backend running at http://localhost:${env.port}`);
  });
}

bootstrap();
