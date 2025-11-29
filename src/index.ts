import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import { redis } from "./setups/redis_setup";
import { connectDB } from "./setups/mongoose_setup";
import nearbyLocationRouter from "./routes/nearby.location";
import loginRouter from "./routes/login.route";
import notifyRouter from "./routes/notify";

const app = express();
const PORT = Number(process.env.PORT) || 3000;


app.use(express.json());
app.use(cors());

app.use("/api", nearbyLocationRouter);
app.use("/api", loginRouter);
app.use("/notify", notifyRouter);

app.get("/", (req, res) => {
  res.send("Garage Finder is running!");
});
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinGarageRoom", (garageId) => {
    socket.join(garageId);
    console.log(`Owner joined garage room: ${garageId}`);
  });
});

server.listen(PORT, async () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 Socket.IO server is ready`);
  
  try {
    await redis.get("name");
    console.log("✅ Redis is working");
  } catch (err) {
    console.error("❌ Redis connection error:", err);
    console.log("⚠️  Server will continue without Redis (some features may not work)");
  }
  
  try {
    await connectDB();
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    console.log("⚠️  Server will continue without MongoDB (some features may not work)");
  }
});

server.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use. Please use a different port.`);
  } else {
    console.error("❌ Server error:", err);
  }
  process.exit(1);
});

export { io, server };
