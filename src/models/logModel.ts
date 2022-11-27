import mongoose from "mongoose";

export interface ILog {
  name: string;
  body: string;
}

export interface LogDoc extends mongoose.Document {
  number: string;
  name: string;
}

interface LogModelInterface extends mongoose.Model<LogDoc> {
  build(attr: ILog): LogDoc;
}

const logSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

logSchema.statics.build = (attr: ILog) => {
  return new Log(attr);
};

export const Log = mongoose.model<LogDoc, LogModelInterface>(
  "Log",
  logSchema
);
