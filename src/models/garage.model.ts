import mongoose, { Document, Schema } from "mongoose";

export interface IGarage extends Document {
  email: string;
  password: string;
  owner_name: string;
  garage_name: string;
  phone_number: string;
  address: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
}

const GarageSchema: Schema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    owner_name: { type: String, required: true },
    garage_name: { type: String, required: true },
    phone_number: { type: String, required: true },
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IGarage>("Garage", GarageSchema);
