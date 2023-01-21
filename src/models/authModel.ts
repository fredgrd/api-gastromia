// --------------------------------------------------------------------------
// Helpers

export const isSignupToken = (token: any): token is ISignupToken => {
  const unsafeCast = token as ISignupToken;

  return (
    unsafeCast.number !== undefined &&
    unsafeCast.iat !== undefined &&
    unsafeCast.exp !== undefined
  );
};

export const isAuthToken = (token: any): token is IAuthToken => {
  const unsafeCast = token as IAuthToken;

  return (
    unsafeCast.id !== undefined &&
    unsafeCast.stripe_id !== undefined &&
    unsafeCast.number !== undefined &&
    unsafeCast.iat !== undefined &&
    unsafeCast.exp !== undefined
  );
};

export const isOperatorToken = (token: any): token is IOperatorToken => {
  const unsafeCast = token as IOperatorToken;

  return (
    unsafeCast.id !== undefined &&
    unsafeCast.iat !== undefined &&
    unsafeCast.exp !== undefined
  );
};

// --------------------------------------------------------------------------
// Interface / Schema / Model

export interface ISignupToken {
  number: string;
  iat?: number;
  exp?: number;
}

export interface IAuthToken {
  id: string;
  stripe_id: string;
  number: string;
  iat?: number;
  exp?: number;
}

export interface IOperatorToken {
  id: string;
  iat?: number;
  exp?: number;
}
