import mongoose from "mongoose";

export interface IAddition {
  name: string;
  unique_tag: string;
  price: number;
  available: boolean;
  mediaUrl: string;
}

export interface AdditionDoc extends mongoose.Document {
  name: string;
  unique_tag: string;
  price: number;
  available: boolean;
  mediaUrl: string;
}

interface AdditionModelInterface extends mongoose.Model<AdditionDoc> {
  build(attr: IAddition): AdditionDoc;
}

const additionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  unique_tag: {
    type: String,
    require: true,
    default: "",
  },
  price: {
    type: Number,
    required: true,
  },
  available: {
    type: Boolean,
    required: true,
    default: true,
  },
  media_url: {
    type: String,
    required: true,
    default: "",
  },
});

additionSchema.statics.build = (attr: IAddition) => {
  return new Addition(attr);
};

export const Addition = mongoose.model<AdditionDoc, AdditionModelInterface>(
  "Addition",
  additionSchema
);
