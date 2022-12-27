import mongoose from "mongoose";

export interface IAdditionGroupRules {
  group_min: number;
  group_max: number;
  addition_max: number;
}

export interface IAdditionGroup {
  _id: string;
  withMedia: boolean;
  rules: IAdditionGroupRules;
  name: string;
  description: string;
  additions: [string];
}

const AdditionGroupRules = new mongoose.Schema(
  {
    group_min: {
      type: Number,
      required: true,
      default: 0,
    },
    group_max: {
      type: Number,
      required: true,
      default: 99,
    },
    addition_max: {
      type: Number,
      required: true,
      default: 99,
    },
  },
  { _id: false }
);

export const AdditionGroupSchema = new mongoose.Schema({
  withMedia: {
    type: Boolean,
    required: true,
  },
  rules: {
    type: AdditionGroupRules,
    required: true,
  },
  additions: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Addition",
    required: true,
    default: [],
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});
