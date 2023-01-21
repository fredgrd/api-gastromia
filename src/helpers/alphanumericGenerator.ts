// Generates a random alphanumeric code of length N
// Used to generate a reference code when creating an order
export const randomAlphanumeric = (length: number) => {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  let result = "";

  for (let i = length; i > 0; --i) {
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  }

  return result.toUpperCase();
};
