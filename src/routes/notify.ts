import Redis from "ioredis";
import { redis } from "../setups/redis_setup";
import { io } from "../index";
import express from "express";

const router = express.Router();
router.post("/", async (req, res) => {
    const { garageId, userId } = req.body;console.log(garageId, userId);

  
    // Update Redis count
    const newCount = await redis.incr(`${garageId}:incomingCount`);
    console.log(newCount);
  
    // Emit event to garage owner
    io.to(garageId).emit("incomingUserCountUpdated", newCount);
  
    res.json({ success: true, message: "Owner notified" });
  });
  export default router;