import { Schema, Types, model } from "mongoose";

// --------------------------------------------------------------------------
// Helpers

export const isUser = (user: any): user is IUser => {
  const unsafeCast = user as IUser;

  return (
    unsafeCast._id !== undefined &&
    unsafeCast.number !== undefined &&
    unsafeCast.name !== undefined &&
    unsafeCast.email !== undefined &&
    unsafeCast.createdAt !== undefined
  );
};

// --------------------------------------------------------------------------
// Interface / Schema / Model

export interface IUser {
  _id?: Types.ObjectId;
  stripe_id: string;
  number: string;
  name: string;
  email?: string;
  createdAt?: Date;
}

const userSchema = new Schema({
  stripe_id: {
    type: String,
    required: true,
  },
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
  email: {
    type: String,
    required: true,
    default: " ",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = model<IUser>("User", userSchema);
