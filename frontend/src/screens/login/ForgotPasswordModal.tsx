import React, { useRef, useState } from "react";
import forgotPasswordImage from "../../assets/images/forgot-password.svg";
import newPasswordImage from "../../assets/images/new-password.svg";
import otpImage from "../../assets/images/otp.svg";
import Modal from "../../components/shared/Modal";

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
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const otpRefs = useRef<Array<HTMLInputElement | null>>(
    new Array(6).fill(null)
  ); // refs for OTP inputs

  const handleNext = () => {
    if (modalStage < 3) {
      setModalStage(modalStage + 1);
    } else {
      onClose();
      setModalStage(1);
      // Add logic here for final submission if needed
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
          subheading:
            "Please enter 6 digit OTP we’ve sent to warren.wade@example.com",
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
            <button className="text-xs text-blue-500 font-semibold underline">
              Didn't Receive Code?
            </button>
            <h5 className="md:mr-3 text-blue-500">00:00</h5>
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
            placeholder={placeholder}
            className="w-full pl-3 py-3 border-2 border-gray-200 focus:outline-blue-500 rounded"
          />
        </div>
      )}
    </Modal>
  );
};

export default ForgotPasswordModal;
