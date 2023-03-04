import { Request, Response } from 'express';
import { MongooseError } from 'mongoose';
import authenticateOperator from '../helpers/authenticateOperator';
import { signOperatorToken } from '../helpers/jwtTokens';
import { Operator } from '../models/operatorModel';

// Logs in the operator
// Returns an OperatorToken
export const loginOperator = async (req: Request, res: Response) => {
  const { email, password }: { email: string | any; password: string | any } =
    req.body;

  if (!email || typeof email !== 'string') {
    console.log('LoginOperator error: NoEmail');
    res.status(400).send('NoEmail');
    return;
  }

  if (!password || typeof password !== 'string') {
    console.log('LoginOperator error: NoPassword');
    res.status(400).send('NoPassword');
    return;
  }

  try {
    const operator = await Operator.findOne({ email: email }).orFail();

    const passwordMatch = operator.password === password;

    if (passwordMatch) {
      // Set cookie
      const token = signOperatorToken({ id: operator.id });

      res.cookie('operator_token', token, {
        maxAge: 60 * 60 * 24 * 10 * 1000, // 60s * 60m * 24h * 10d => 10 Days in secods => in milliseconds
        httpOnly: true,
        secure: true,
        domain: 'gastromia.com',
      });

      res.status(200).json({
        _id: operator.id,
        name: operator.name,
        surname: operator.surname,
        email: operator.email,
      });
    } else {
      console.log('LoginOperator error: WrongPassword');
      res.status(400).send('WrongPassword');
    }
  } catch (error) {
    const mongooseError = error as MongooseError;
    if (mongooseError.name === 'DocumentNotFoundError') {
      res.status(400).send('No Email');
      return;
    }
    console.log(
      `LoginOperator error: ${mongooseError.name} ${mongooseError.message}`
    );
    res.sendStatus(500);
  }
};

// Logs out the operator
// Removes the OperatorToken from the browser
export const logoutOperator = async (req: Request, res: Response) => {
  res.clearCookie('operator_token', {
    httpOnly: true,
    secure: true,
    domain: 'gastromia.com',
  });
  res.sendStatus(200);
};

export const fetchOperator = async (req: Request, res: Response) => {
  const operatorToken = authenticateOperator(req, res, 'FetchOperator');

  if (!operatorToken) {
    return;
  }

  try {
    const operator = await Operator.findById(operatorToken.id).orFail();

    const token = signOperatorToken({ id: operator.id });

    res.cookie('operator_token', token, {
      maxAge: 60 * 60 * 24 * 10 * 1000, // 60s * 60m * 24h * 10d => 10 Days in secods => in milliseconds
      httpOnly: true,
      secure: true,
      domain: 'gastromia.com',
    });

    res.status(200).json({
      _id: operator.id,
      name: operator.name,
      surname: operator.surname,
      email: operator.email,
    });
  } catch (error) {
    const mongooseError = error as MongooseError;
    console.log(
      `LoginOperator error: ${mongooseError.name} ${mongooseError.message}`
    );
    res.sendStatus(500);
  }
};
