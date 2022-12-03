import mongoose from "mongoose";

export interface IUser {
  number: string;
  name: string;
}

export interface UserDoc extends mongoose.Document {
  id: string
  number: string;
  name: string;
  createdAt: Date;
}

interface UserModelInterface extends mongoose.Model<UserDoc> {
  build(attr: IUser): UserDoc;
}

const userSchema = new mongoose.Schema({
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

userSchema.statics.build = (attr: IUser) => {
  return new User(attr);
};

export const User = mongoose.model<UserDoc, UserModelInterface>(
  "User",
  userSchema
);
