import { Schema, Types, model } from "mongoose";

// --------------------------------------------------------------------------
// Interface / Schema

export interface ILocation {
  _id?: Types.ObjectId;
  name: string;
  address: string;
  locality: string;
  is_open: boolean;
}

const LocationSchema = new Schema<ILocation>({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  locality: {
    type: String,
    required: true,
  },
  is_open: {
    type: Boolean,
    required: true,
  },
});

export const Location = model<ILocation>("Location", LocationSchema);
