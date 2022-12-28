import jwt, { JwtPayload } from "jsonwebtoken";

class DatabaseService {
  private readonly operationSecret: string;

  constructor() {
    this.operationSecret = process.env.DB_OPERATION_SECRET || "";
  }

  verifyToken(token: string): string | null {
    try {
      const decoded = jwt.verify(token, this.operationSecret);
      return (decoded as JwtPayload).email;
    } catch (error) {
      console.log(`DatabaseServiceVerifyToken error: ${error}`);
      return null;
    }
  }
}

export default DatabaseService;
