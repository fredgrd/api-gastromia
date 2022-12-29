import { Schema, Types, model } from "mongoose";

export interface IUser {
  _id?: Types.ObjectId;
  number: string;
  name: string;
  createdAt?: Date;
}

const userSchema = new Schema({
  number: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = model<IUser>("User", userSchema);
