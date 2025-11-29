import { Request, Response } from "express";
import Garage from "../models/garage.model";
import express from "express";

const router = express.Router();

router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const garage = await Garage.findOne({ email });
    if(!garage){
        return res.status(400).send({message:"Garage not found"});
    }
    const isPasswordValid = password === garage.password;
    if(!isPasswordValid){
        return res.status(400).send({message:"Invalid password"});
    }
    res.status(200).send({message:"Login Successfully", garage: garage.toObject()});
});

export default router;