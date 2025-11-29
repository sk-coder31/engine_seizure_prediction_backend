import type { IRegisterLocation } from "../types/type";
import type { Request, Response } from 'express';
import { saveLocationToRedis , getNearbyGarages} from "../service/location";
import Garage from "../models/garage.model";

const express = require('express');
const router = express.Router();
router.post("/register", async (req:Request, res:Response)=>{
    const data:IRegisterLocation = req.body;
    const check = await saveLocationToRedis(data);
    if(!check){
        return res.status(400).send({message:"Location Already Exists"});
    }
    const garage = new Garage(data);
    await garage.save();
    if(!garage){
        return res.status(400).send({message:"Failed to register garage"});
    }
    res.status(200).send({message:"Garage Registered Successfully"});

})

router.get("/find-nearby/:latitude/:longitude/:radius", async (req: Request, res: Response) => {
    try {
        const { latitude, longitude, radius } = req.params;
        
        // Validate parameters exist
        if (!latitude || !longitude || !radius) {
            return res.status(400).json({
                message: "Missing required parameters: latitude, longitude, and radius are required."
            });
        }
        
        // Convert to numbers
        const lat = Number(latitude);
        const lon = Number(longitude);
        const rad = Number(radius);
        console.log(lat, lon, rad);
        
        // Validate they are valid numbers
        if (isNaN(lat) || isNaN(lon) || isNaN(rad)) {
            console.log(lat, lon, rad);
            return res.status(400).json({
                message: "Invalid parameters. Latitude, longitude, and radius must be valid numbers."
            });
        }
        
        // Validate ranges
        if (lat < -90 || lat > 90) {
            return res.status(400).json({
                message: "Latitude must be between -90 and 90."
            });
        }
        
        if (lon < -180 || lon > 180) {
            return res.status(400).json({
                message: "Longitude must be between -180 and 180."
            });
        }
        
        if (rad <= 0) {
            return res.status(400).json({
                message: "Radius must be a positive number."
            });
        }
        
        console.log(`Fetching garages near: ${lat}, ${lon} within ${rad} km`);
        
        const nearbyGarages = await getNearbyGarages(lat, lon, rad);
        
        console.log(`Found ${nearbyGarages.length} nearby garages`);
        
        return res.status(200).json({
            message: "Nearby Garages Fetched Successfully",
            data: nearbyGarages,
            count: nearbyGarages.length
        });
        
    } catch (error) {
        console.error("Error in find-nearby route:", error);
        return res.status(500).json({
            message: "Internal server error while fetching nearby garages.",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});
export default router;