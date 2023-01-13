// --------------------------------------------------------------------------
// Helpers

export const isDatabaseOpsToken = (token: any): token is IDatabaseOpsToken => {
  const unsafeCast = token as IDatabaseOpsToken;

  return (
    unsafeCast.name !== undefined &&
    unsafeCast.email !== undefined &&
    unsafeCast.iat !== undefined &&
    unsafeCast.exp !== undefined
  );
};

// --------------------------------------------------------------------------
// Interface / Schema / Model

export interface IDatabaseOpsToken {
  name: string;
  email: string;
  iat?: number;
  exp?: number;
}
