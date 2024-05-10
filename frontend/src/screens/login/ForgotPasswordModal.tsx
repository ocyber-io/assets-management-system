import React, { useEffect, useRef, useState } from "react";
import forgotPasswordImage from "../../assets/images/forgot-password.svg";
import newPasswordImage from "../../assets/images/new-password.svg";
import otpImage from "../../assets/images/otp.svg";
import Modal from "../../components/shared/Modal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../stores/store";
import {
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../../reducers/user/userThunks";
import { showErrorToast, showSuccessToast } from "../../utils/toast"; // Ensure toast utilities are correctly imported
import { unwrapResult } from "@reduxjs/toolkit";

type ForgotPasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [modalStage, setModalStage] = useState<number>(1);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill("-")); // Array to hold OTP values
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const [displayTime, setDisplayTime] = useState("");
  const countdownRef = useRef(3600); // Ref to hold the countdown seconds
  const intervalRef = useRef<number | null>(null);
  const buttonTimerRef = useRef(60);
  const [buttonTimer, setButtonTimer] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    let timerId: any;
    if (buttonDisabled) {
      timerId = setInterval(() => {
        buttonTimerRef.current -= 1;
        if (buttonTimerRef.current <= 0) {
          clearInterval(timerId);
          setButtonDisabled(false);
          buttonTimerRef.current = 60;
        }
        setButtonTimer(buttonTimerRef.current);
      }, 1000);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [buttonDisabled]);

  const { otpVerificationStatus, error } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    if (otpVerificationStatus === "idle") {
      setModalStage(3);
    }
  }, [error]);

  const otpRefs = useRef<Array<HTMLInputElement | null>>(
    new Array(6).fill(null)
  ); // refs for OTP inputs

  const handleNext = async () => {
    if (modalStage === 1) {
      if (email === "") {
        showErrorToast("Please enter a valid email address");
        return;
      }
      setModalStage(2);
      startTimer(); // Move to the OTP stage immediately.
      try {
        const forgotPasswordAction = await dispatch(forgotPassword(email));
        unwrapResult(forgotPasswordAction);
      } catch (error: any) {
        setModalStage(1);
        showErrorToast(
          error.error || "The email address is incorrect or doesn't exist."
        );
      }
    } else if (modalStage === 2) {
      try {
        const actionResult = await dispatch(
          verifyOtp({ email, otp: otp.join("") })
        );
        const data = unwrapResult(actionResult);
        setUserId(data.userId);
        showSuccessToast(
          `OTP verified successfully, Please change your password`
        );
        setModalStage(3);
      } catch (error: any) {
        showErrorToast(error.error || "OTP verification failed");
      }
    } else if (modalStage === 3) {
      if (password !== confirmPassword) {
        showErrorToast("Passwords do not match");
        return;
      }
      if (password === "" && confirmPassword === "") {
        showErrorToast("Password cannot be empty");
        return;
      }
      try {
        const resetAction = await dispatch(
          resetPassword({ userId, newPassword: password })
        );
        unwrapResult(resetAction);
        showSuccessToast("Password has been reset successfully");
        onClose();
      } catch (error: any) {
        showErrorToast(error.error || "Failed to reset password");
      }
    }
  };

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    // Ensure that only single-digit numbers are handled
    if (/^[0-9]$/i.test(value)) {
      // Update OTP array with new value
      setOtp([...otp.slice(0, index), value, ...otp.slice(index + 1)]);

      // Attempt to focus the next input if it exists and is not null
      if (index < 5 && otpRefs.current[index + 1]) {
        const nextInput = otpRefs.current[index + 1];
        if (nextInput) {
          nextInput.focus(); // Move focus to next input
        }
      }
    }
  };

  const startTimer = () => {
    countdownRef.current = 3600; // Reset countdown seconds to 3600
    updateDisplayTime(countdownRef.current);

    // Clear any existing timer
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }

    // Start a new timer
    intervalRef.current = setInterval(() => {
      countdownRef.current -= 1;
      updateDisplayTime(countdownRef.current);

      if (countdownRef.current <= 0 && intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null; // Make sure to nullify the ref after clearing
      }
    }, 1000);
  };

  const updateDisplayTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsLeft = seconds % 60;
    setDisplayTime(
      `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(secondsLeft).padStart(2, "0")}`
    );
  };

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const codeNotReceivedHandler = () => {
    if (!window.confirm("Are you sure you want to resend the OTP?")) {
      return;
    }
    dispatch(forgotPassword(email));
    showSuccessToast("OTP resent successfully");
    setButtonDisabled(true);
    startTimer();
  };

  const renderContent = () => {
    switch (modalStage) {
      case 1:
        return {
          image: forgotPasswordImage,
          heading: "Forgot password",
          subheading:
            "Please provide the email address linked to your account.",
          inputLabel: "Email",
          inputType: "email",
          placeholder: "example@email.com",
        };
      case 2:
        return {
          image: otpImage,
          heading: "Enter OTP",
          subheading: `Please enter 6 digit OTP we’ve sent to ${email}`,
          inputLabel: "OTP",
          inputType: "text",
          placeholder: "Enter OTP here",
        };
      case 3:
        return {
          image: newPasswordImage,
          heading: "Create new password",
          subheading: "Create a Strong and Secure Password",
          inputLabel: "New Password",
          inputType: "password",
          placeholder: "Enter new password",
        };
      default:
        return {};
    }
  };

  const { image, heading, subheading, inputLabel, inputType, placeholder } =
    renderContent();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      image={image}
      heading={heading}
      subheading={subheading}
      buttonText={modalStage < 3 ? "Next" : "Change Password"}
      onButtonClick={handleNext}
    >
      {modalStage === 2 ? (
        <>
          <div className="flex justify-center md:space-x-8 space-x-3">
            {otp.map((value, index) => (
              <input
                key={index}
                ref={(el) => (otpRefs.current[index] = el)}
                className="md:w-12 md:h-12 w-8 h-8 text-center font-bold border-2 rounded"
                type="text"
                maxLength={1}
                value={value}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e: React.FocusEvent<HTMLInputElement>) =>
                  e.target.select()
                }
              />
            ))}
          </div>
          <div className="w-full flex justify-end mt-2 gap-x-2">
            <button
              className={`text-xs font-semibold underline ${
                buttonDisabled ? "text-gray-400" : "text-blue-500"
              }`}
              onClick={codeNotReceivedHandler}
              disabled={buttonDisabled}
            >
              {buttonDisabled
                ? `Please wait ${buttonTimer}s`
                : "Didn't Receive Code?"}
            </button>
            <h5 className="md:mr-3 text-blue-500">{displayTime}</h5>
          </div>
        </>
      ) : modalStage === 3 ? (
        <>
          <label htmlFor="password" className="font-bold">
            New Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 pl-3 py-3 border-2 border-gray-200 focus:outline-blue-500 rounded"
            placeholder="Enter new password"
          />
          <div className="mt-4">
            <label htmlFor="confirmPassword" className="font-bold">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-1 pl-3 py-3 border-2 border-gray-200 focus:outline-blue-500 rounded"
              placeholder="*********"
            />
          </div>
        </>
      ) : (
        <div className="mt-4">
          <label htmlFor="modalInput" className="font-bold">
            {inputLabel}
          </label>
          <input
            type={inputType}
            id="modalInput"
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-3 py-3 border-2 border-gray-200 focus:outline-blue-500 rounded"
          />
        </div>
      )}
    </Modal>
  );
};

export default ForgotPasswordModal;
