// src/utils/validator.ts
import { showErrorToast } from "./toast"; // Assuming toast functions are exported from this file

type SignUpForm = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

export const validateSignUpForm = (formData: SignUpForm): boolean => {
  const { firstname, lastname, email, password } = formData;

  // Validate First Name
  if (!firstname.trim()) {
    showErrorToast("First name is required");
    return false;
  }

  // Validate Last Name
  if (!lastname.trim()) {
    showErrorToast("Last name is required");
    return false;
  }

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
  } else if (password.length < 6) {
    showErrorToast("Password must be at least 6 characters long");
    return false;
  }

  return true; // All validations passed
};
