import jwt, { JwtPayload } from "jsonwebtoken";
import { User, UserDoc, IUser } from "../models/userModel";

export class UserService {
  private readonly jwtSecret: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || "";
  }

  signToken(number: string): string {
    const token = jwt.sign({ number: number }, this.jwtSecret, {
      expiresIn: "365d",
    });

    return token;
  }

  verifyToken(token: string): string | undefined {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      return (decoded as JwtPayload).number;
    } catch (error) {
      console.log(`VerifyToken error: ${error}`);
      return;
    }
  }

  async fetchUser(number: string): Promise<UserDoc | null> {
    try {
      const foundUser = User.findOne({ number: number });
      return foundUser;
    } catch (error) {
      console.log(`FetchUser error: ${error}`);
      return null;
    }
  }

  async createUser(attr: IUser): Promise<UserDoc | undefined> {
    try {
      const user = User.build(attr);
      await user.save();

      console.log("CREATED");
      return user;
    } catch (error) {
      console.log(`CreateUser error: ${error}`);
      return;
    }
  }
}
