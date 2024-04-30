import React, { useState } from "react";
import NotificationModal from "../../components/shared/NotificationModal"; // Make sure the path is correct
import showPasswordIcon from "../../assets/icons/view.svg"; // Ensure the path is correct

const EditProfileModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Function to toggle password visibility
  const toggleShowPassword = (field: "current" | "new" | "confirm") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <NotificationModal
      isOpen={isOpen}
      heading="Edit Profile"
      headingStyles="font-semibold text-lg"
      closeModal={onClose}
      onSubmit={() => alert("Profile Updated!")} // Example onSubmit function
      onCancel={onClose}
      cancelButtonText="Cancel"
      cancelButtonStyle=" bg-transparent border-2 border-gray-200 hover:bg-gray-50"
      submitButtonText="Continue"
      submitButtonStyle="bg-blue-500 hover:bg-blue-600"
    >
      <form className="mt-4 space-y-4 text-left">
        <div className="flex gap-x-4">
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">First Name</label>
            <input
              type="text"
              placeholder="Paul"
              className="border-2 w-full border-gray-200 p-2 mt-1 rounded focus:outline-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">Last Name</label>
            <input
              type="text"
              placeholder="Walker"
              className="border-2 w-full border-gray-200 p-2 mt-1 rounded focus:outline-blue-500"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">Email</label>
          <input
            type="email"
            placeholder="example@email.com"
            className="border-2 border-gray-200 p-2 mt-1 rounded focus:outline-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">
            Current Password
          </label>
          <div className="flex items-center border-2 border-gray-200 rounded mt-1 focus-within:border-2 focus-within:border-blue-500">
            <input
              type={showPassword.current ? "text" : "password"}
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
              type={showPassword.new ? "text" : "password"}
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
              type={showPassword.confirm ? "text" : "password"}
              placeholder="Confirm your new password"
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
      </form>
    </NotificationModal>
  );
};

export default EditProfileModal;
