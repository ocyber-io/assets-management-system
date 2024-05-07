import crypto from "crypto";

export const generateOTP = () => {
  const otp = crypto.randomInt(100000, 1000000); // generates a six-digit number
  return otp.toString();
};
