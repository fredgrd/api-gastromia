import { Request, Response } from "express";
import { UserService } from "../services/userService";

// Fetches the user from the provided token
export const fetchUser = async (req: Request, res: Response) => {
  console.log("Call", Date.now());
  const token = req.cookies.token;
  const userService = new UserService();

  console.log("HAS TOKEN?", token);

  if (!token) {
    res.sendStatus(400);
    return;
  }

  // Verify token
  const userNumber = userService.verifyToken(token || "");
  const foundUser = await userService.fetchUser(userNumber || "");

  if (foundUser) {
    const token = userService.signToken(userNumber ?? "");

    res.cookie("token", token, {
      maxAge: 60 * 60 * 24 * 10 * 1000, // 60s * 60m * 24h * 10d => 10 Days in secods => in milliseconds
      httpOnly: true,
      secure: true,
    });

    res.status(200).json({
      id: foundUser._id,
      name: foundUser.name,
      number: foundUser.number,
    });
  } else {
    console.log(`Could not find users for: ${userNumber}`);
    res.sendStatus(400);
  }
};

export const createUser = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  const name = req.body.name;
  const userService = new UserService();

  if (!token) {
    res.sendStatus(400);
    return;
  }

  // Verify token
  const userNumber = userService.verifyToken(token || "");
  const foundUser = await userService.fetchUser(userNumber || "");

  if (userNumber && !foundUser) {
    const newUser = await userService.createUser({
      number: userNumber,
      name: name,
    });

    if (newUser) {
      const token = userService.signToken(userNumber ?? "");

      res.cookie("token", token, {
        maxAge: 60 * 60 * 24 * 10 * 1000, // 60s * 60m * 24h * 10d => 10 Days in secods => in milliseconds
        httpOnly: true,
        secure: true,
      });

      res.status(200).json({
        id: newUser._id,
        name: newUser.name,
        number: newUser.number,
      });
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(400);
  }
};
