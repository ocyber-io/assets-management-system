// src/utils/validator.ts
import { showErrorToast } from "./toast"; // Assuming toast functions are exported from this file

type LoginForm = {
  email: string;
  password: string;
};

export const validateLoginForm = (formData: LoginForm): boolean => {
  const { email, password } = formData;
  // Validate Email
  if (!email.trim()) {
    showErrorToast("Email is required");
    return false;
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    showErrorToast("Invalid email address");
    return false;
  }

  // Validate Password
  if (!password) {
    showErrorToast("Password is required");
    return false;
  }

  return true;
};
