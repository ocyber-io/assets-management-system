import React from "react";
import { useDispatch } from "react-redux";
import { UserInfo } from "../../../Types";
import editProfileCover from "../../../assets/images/editProfileCover.svg";
import {
  changePasswordIcon,
  editIcon,
  emailIcon,
  logoutIcon,
} from "../../../helpers/icons";
import { logout } from "../../../reducers/user/userSlice";
import { AppDispatch } from "../../../stores/store";

type EditProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  handleEditProfileDetailsModal: () => void;
  handleChangePasswordModal: () => void;
  userInfo: UserInfo | undefined;
  userInitials: string;
};

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  userInfo,
  userInitials,
  handleEditProfileDetailsModal,
  handleChangePasswordModal,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  // Close both modals when onClose is called
  const handleCloseModals = () => {
    onClose();
  };

  if (!isOpen) return null;

  const logoutHandler = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    dispatch(logout());
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-lg max-w-lg relative">
          <button
            onClick={handleCloseModals}
            className="absolute text-4xl top-1 font-extralight right-3 text-gray-400 hover:text-gray-300 z-50"
          >
            &times;
          </button>
          <div className="relative">
            <div className="h-32 rounded-t-2xl">
              <img src={editProfileCover} alt="Cover" />
            </div>
            {userInfo &&
            userInfo.profilePicture !== "" &&
            userInfo.profilePicture !== undefined ? (
              <div className="w-24 h-24 rounded-lg border-2 border-white mr-4 cursor-pointer absolute left-9 -bottom-12">
                <img
                  src={
                    userInfo &&
                    `/uploads/${userInfo.id}/${userInfo.profilePicture}`
                  }
                  className="w-24 h-24 rounded-lg object-cover"
                />
              </div>
            ) : (
              <button className="bg-yellow-400 cursor-auto text-4xl text-white rounded-lg font-bold w-24 h-24 border-2 border-white absolute left-9 -bottom-12">
                {userInitials}
              </button>
            )}
          </div>
          <div className="p-6">
            <div className="mt-10 ml-4">
              <div className="font-semibold text-xl">
                {userInfo?.firstname} {userInfo?.lastname}
              </div>
              <div className="text-gray-400 text-sm mt-1">Admin</div>
            </div>
            <div className="mt-6 pl-4 flex items-center justify-between text-gray-600">
              <img src={emailIcon} className="mr-2" alt="Email Icon" />
              <span className="flex-1 text-left">Email</span>
              <span className="text-right">{userInfo?.email}</span>
            </div>
            <div className="my-6 border-t border-gray-200"></div>
            <div className="flex flex-col space-y-2">
              <button
                className="flex items-center bg-transparent text-black px-4 py-2 rounded-md hover:bg-gray-50"
                onClick={handleEditProfileDetailsModal}
              >
                <img src={editIcon} className="mr-2" alt="Edit Icon" />
                Edit Profile
              </button>
              <button
                className="flex items-center bg-transparent text-black px-4 py-2 rounded-md hover:bg-gray-50"
                onClick={handleChangePasswordModal}
              >
                <img
                  src={changePasswordIcon}
                  className="mr-2"
                  alt="Change Password Icon"
                />
                Change Password
              </button>
              <button
                className="flex items-center bg-transparent text-red-500 px-4 py-2 rounded-md hover:bg-gray-50"
                onClick={logoutHandler}
              >
                <img src={logoutIcon} className="mr-2" alt="Logout Icon" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfileModal;
