import { Request, Response } from "express";
import { MongooseError } from "mongoose";
import authenticateOperator from "../helpers/authenticateOperator";
import { Location } from "../models/locationModel";

// Fetches the location status
// Used by both Gastromia WebApp and the Hub Manager
export const fetchLocationStatus = async (req: Request, res: Response) => {
  const locationId = "63c2dddb8da9d8981bcc335a";

  try {
    const location = await Location.findById(locationId).orFail();

    res.status(200).json({ is_open: location.is_open });
  } catch (error) {
    const mongooseError = error as MongooseError;
    console.log(
      `FetchLocation error: ${mongooseError.name} ${mongooseError.message}`
    );
    res.sendStatus(500);
  }
};

// Updates the status (is_open) of the location
// Used only by the Hub Manager
export const updateLocationStatus = async (req: Request, res: Response) => {
  const operatorToken = authenticateOperator(req, res, "UpdateLocationStatus");

  if (!operatorToken) {
    res.sendStatus(403);
    return;
  }

  const locationId = "63c2dddb8da9d8981bcc335a";
  const status: boolean | any = req.body.status;

  console.log(status, typeof status);

  if (typeof status !== "boolean") {
    res.sendStatus(400);
    return;
  }

  try {
    const location = await Location.findByIdAndUpdate(
      locationId,
      {
        is_open: status,
      },
      { new: true }
    ).orFail();
    res.status(200).json({ is_open: location.is_open });
  } catch (error) {
    const mongooseError = error as MongooseError;
    console.log(
      `FetchLocation error: ${mongooseError.name} ${mongooseError.message}`
    );
    res.sendStatus(500);
  }
};
