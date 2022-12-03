import jwt, { JwtPayload } from "jsonwebtoken";
import { Log, LogDoc, ILog } from "../models/logModel";

export class LoggerService {
  constructor() {}

  async createLog(attr: ILog): Promise<LogDoc | undefined> {
    try {
      const log = Log.build(attr);
      await log.save();
      return log;
    } catch (error) {
      console.log(`CreateLog Error: ${error}`);
      return;
    }
  }
}
