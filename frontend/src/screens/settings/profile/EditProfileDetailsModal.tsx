import React, { useState } from "react";
import { UserInfo } from "../../../Types";
import editProfileCover from "../../../assets/images/editProfileCover.svg";
import { AppDispatch } from "../../../stores/store";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../reducers/user/userThunks";
import { showErrorToast, showSuccessToast } from "../../../utils/toast";

type EditProfileDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userInfo: UserInfo | undefined;
  userInitials: string;
};

const EditProfileDetailsModal: React.FC<EditProfileDetailsModalProps> = ({
  isOpen,
  onClose,
  userInfo,
  userInitials,
}) => {
  const [firstName, setFirstName] = useState(userInfo?.firstname || "");
  const [lastName, setLastName] = useState(userInfo?.lastname || "");
  const [email, setEmail] = useState(userInfo?.email || "");
  const dispatch = useDispatch<AppDispatch>();

  const handleUpdate = async () => {
    const updatePayload = {
      firstname: firstName,
      lastname: lastName,
      email: email,
    };
    try {
      await dispatch(
        updateUser({
          id: userInfo!.id,
          updates: updatePayload,
        })
      ).unwrap();
      showSuccessToast("Profile updated successfully");
      onClose();
    } catch (error: any) {
      showErrorToast("Error updating profile: " + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute text-4xl top-1 font-extralight right-3 text-gray-400 hover:text-gray-300 z-50"
        >
          &times;
        </button>
        <div className="relative">
          <div className="h-32 rounded-t-2xl">
            <img src={editProfileCover} alt="Cover" />
          </div>
          <button className="bg-yellow-400 cursor-auto text-4xl text-white rounded-lg font-bold w-24 h-24 border-2 border-white absolute left-9 -bottom-12">
            {userInitials}
          </button>
          <button className="bg-transparent text-blue-600 absolute left-36">
            Change Image
          </button>
        </div>
        <div className="p-6">
          {/*  */}
          <div className="mt-12 pl-4 flex flex-col space-y-4">
            <div className="flex space-x-4">
              <div className="flex flex-col w-1/2">
                <label className="text-gray-800 mb-2 font-semibold">
                  First Name
                </label>
                <input
                  type="text"
                  className="border border-gray-200 rounded-md px-2 py-3 focus:outline-blue-500"
                  placeholder="Alan"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-1/2">
                <label className="text-gray-800 mb-2 font-semibold">
                  Last Name
                </label>
                <input
                  type="text"
                  className="border border-gray-200 rounded-md px-2 py-3 focus:outline-blue-500"
                  placeholder="Walker"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-800 mb-2 font-semibold">Email</label>
              <input
                type="email"
                className="border border-gray-200 rounded-md px-2 py-3 focus:outline-blue-500"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-6 pl-4 flex justify-between w-full gap-x-4">
            <button
              className="bg-transparent border w-full text-black  py-2 rounded hover:bg-gray-50"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 w-full text-white  py-3 rounded hover:bg-blue-600"
              onClick={handleUpdate}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileDetailsModal;
