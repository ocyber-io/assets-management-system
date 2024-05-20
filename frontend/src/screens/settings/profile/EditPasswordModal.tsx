import React, { useState } from "react";
import { useDispatch } from "react-redux";
import showPasswordIcon from "../../../assets/icons/view.svg";
import NotificationModal from "../../../components/shared/NotificationModal";
import { AppDispatch } from "../../../stores/store";
import { showErrorToast, showSuccessToast } from "../../../utils/toast";
import { validateUpdateProfile } from "../../../utils/validateUpdateProfile";
import { updateUser } from "../../../reducers/user/userThunks";
import changePasswordImage from "../../../assets/images/changePassword.svg";
type UserInfo = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  googleId: string;
};

const EditPasswordModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  handleChangePasswordSuccessModal: () => void;
  userInfo?: UserInfo;
}> = ({ isOpen, onClose, userInfo, handleChangePasswordSuccessModal }) => {
  if (!isOpen) return null;

  // Initialize form state with userInfo props
  const [formValues, setFormValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const dispatch = useDispatch<AppDispatch>();

  // Function to handle form value changes
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to toggle password visibility
  const toggleShowPassword = (field: "current" | "new" | "confirm") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validate form data before dispatching
    if (
      !validateUpdateProfile({
        newPassword: formValues.newPassword,
        confirmPassword: formValues.confirmPassword,
      })
    ) {
      return; // Stop submission if validation fails
    }

    const updatePayload = {
      ...(formValues.newPassword && {
        password: formValues.newPassword,
        currentPassword: formValues.currentPassword,
      }),
    };

    const resultAction = await dispatch(
      updateUser({
        id: userInfo!.id,
        updates: updatePayload,
      })
    );

    if (updateUser.fulfilled.match(resultAction)) {
      showSuccessToast("Password changed successfully!");
      onClose();
      handleChangePasswordSuccessModal();
    } else if (updateUser.rejected.match(resultAction)) {
      showErrorToast(resultAction.payload || "Failed to update password");
    }
  };
  return (
    <NotificationModal
      imageUrl={changePasswordImage}
      isOpen={isOpen}
      heading="Change Password"
      headingStyles="text-lg font-bold"
      description="Please confirm your current password and create a new password."
      descriptionAndHeadingPosition="text-center"
      closeModal={onClose}
      onSubmit={handleSubmit}
      onCancel={onClose}
      cancelButtonText="Cancel"
      submitButtonText="Continue"
    >
      <form className="mt-4 space-y-4 text-left">
        <>
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">
              Current Password
            </label>
            <div className="flex items-center border-2 border-gray-200 rounded mt-1 focus-within:border-2 focus-within:border-blue-500">
              <input
                name="currentPassword"
                type={showPassword.current ? "text" : "password"}
                value={formValues.currentPassword}
                onChange={handleChange}
                placeholder="Current Password"
                className="p-2 flex-grow focus:outline-none"
              />
              <img
                src={showPasswordIcon}
                alt="Show Password"
                className="mr-2 cursor-pointer"
                onClick={() => toggleShowPassword("current")}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">New Password</label>
            <div className="flex items-center border-2 border-gray-200 rounded mt-1 focus-within:border-2 focus-within:border-blue-500">
              <input
                name="newPassword"
                type={showPassword.new ? "text" : "password"}
                value={formValues.newPassword}
                onChange={handleChange}
                placeholder="Enter your new password"
                className="p-2 flex-grow focus:outline-none"
              />
              <img
                src={showPasswordIcon}
                alt="Show Password"
                className="mr-2 cursor-pointer"
                onClick={() => toggleShowPassword("new")}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">
              Confirm New Password
            </label>
            <div className="flex items-center border-2 border-gray-200 rounded mt-1 focus-within:border-2 focus-within:border-blue-500">
              <input
                name="confirmPassword"
                type={showPassword.confirm ? "text" : "password"}
                placeholder="Confirm your new password"
                value={formValues.confirmPassword}
                onChange={handleChange}
                className="p-2 flex-grow focus:outline-none"
              />
              <img
                src={showPasswordIcon}
                alt="Show Password"
                className="mr-2 cursor-pointer"
                onClick={() => toggleShowPassword("confirm")}
              />
            </div>
          </div>
        </>
      </form>
    </NotificationModal>
  );
};

export default EditPasswordModal;
