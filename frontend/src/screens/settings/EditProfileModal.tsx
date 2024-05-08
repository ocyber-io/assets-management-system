import React, { useState } from "react";
import { useDispatch } from "react-redux";
import showPasswordIcon from "../../assets/icons/view.svg";
import NotificationModal from "../../components/shared/NotificationModal";
import { AppDispatch } from "../../stores/store";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { validateUpdateProfile } from "../../utils/validateUpdateProfile";
import { updateUser } from "../../reducers/user/userThunks";

type UserInfo = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  googleId: string;
};

const EditProfileModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  userInfo?: UserInfo;
}> = ({ isOpen, onClose, userInfo }) => {
  if (!isOpen) return null;

  // Initialize form state with userInfo props
  const [formValues, setFormValues] = useState({
    firstname: userInfo?.firstname || "",
    lastname: userInfo?.lastname || "",
    email: userInfo?.email || "",
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
        firstname: formValues.firstname,
        lastname: formValues.lastname,
        email: formValues.email,
        newPassword: formValues.newPassword,
        confirmPassword: formValues.confirmPassword,
      })
    ) {
      return; // Stop submission if validation fails
    }

    const updatePayload = {
      firstname: formValues.firstname,
      lastname: formValues.lastname,
      email: formValues.email,
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
      showSuccessToast("Profile updated successfully!");
      onClose();
    } else if (updateUser.rejected.match(resultAction)) {
      showErrorToast(resultAction.payload || "Failed to update profile");
    }
  };
  return (
    <NotificationModal
      isOpen={isOpen}
      heading="Edit Profile"
      closeModal={onClose}
      onSubmit={handleSubmit}
      onCancel={onClose}
      cancelButtonText="Cancel"
      submitButtonText="Continue"
    >
      <form className="mt-4 space-y-4 text-left">
        <div className="flex gap-x-4">
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">First Name</label>
            <input
              name="firstname"
              type="text"
              value={formValues.firstname}
              onChange={handleChange}
              placeholder="First Name"
              className="border-2 w-full border-gray-200 p-2 mt-1 rounded focus:outline-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">Last Name</label>
            <input
              name="lastname"
              type="text"
              value={formValues.lastname}
              onChange={handleChange}
              placeholder="Last Name"
              className="border-2 w-full border-gray-200 p-2 mt-1 rounded focus:outline-blue-500"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">Email</label>
          <input
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            placeholder="Email"
            className="border-2 border-gray-200 p-2 mt-1 rounded focus:outline-blue-500"
          />
        </div>
        {!userInfo?.googleId && (
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
              <label className="text-gray-700 font-semibold">
                New Password
              </label>
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
        )}
      </form>
    </NotificationModal>
  );
};

export default EditProfileModal;
