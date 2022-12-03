import { Request, Response } from "express";
import { UserService } from "../services/userService";

export const fetchUser = async (req: Request, res: Response) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  const userService = new UserService();

  console.log("Tried to fetch user", token);

  if (!token) {
    res.sendStatus(400);
    return;
  }

  // Verify token
  const userNumber = userService.verifyToken(token || "");
  const foundUser = await userService.fetchUser(userNumber || "");

  if (foundUser) {
    res.status(200).json(foundUser);
  } else {
    console.log(`Could not find users for: ${userNumber}`);
    res.sendStatus(400);
  }
};

export const createUser = async (req: Request, res: Response) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
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
    res.status(200).json(newUser);
  } else {
    res.sendStatus(400);
  }
};
