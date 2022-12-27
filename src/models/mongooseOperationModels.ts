import mongoose from "mongoose";

export interface MongooseBasicOperationResult {
  success: boolean;
  error: mongoose.MongooseError | undefined;
}
