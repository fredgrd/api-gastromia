import { Schema, Types, model } from "mongoose";

// --------------------------------------------------------------------------
// Interface / Schema / Model

// iat?: number;
// exp?: number;

export interface IOperator {
  _id?: Types.ObjectId;
  name: string;
  surname: string;
  email: string;
  password: string;
}

const OperatorSchema = new Schema<IOperator>({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const Operator = model<IOperator>("Operator", OperatorSchema);

// --------------------------------------------------------------------------
// Helpers

// export const isDatabaseOpsToken = (token: any): token is IDatabaseOpsToken => {
//   const unsafeCast = token as IDatabaseOpsToken;

//   return (
//     unsafeCast.name !== undefined &&
//     unsafeCast.email !== undefined &&
//     unsafeCast.iat !== undefined &&
//     unsafeCast.exp !== undefined
//   );
// };
