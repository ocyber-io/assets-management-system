import React, { useEffect, useState } from "react";
import editUserImage from "../../../assets/icons/edit-userBlack.svg";
import { jwtDecode } from "jwt-decode";
import EditProfileModal from "./EditProfileModal";
import EditProfileDetailsModal from "./EditProfileDetailsModal";
import EditPasswordModal from "./EditPasswordModal";
import ChangePasswordSuccessModal from "./ChangePasswordSuccessModal";

type UserInfo = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  googleId: string;
};

const ProfileDashboard: React.FC = () => {
  const token = localStorage.getItem("token");
  const [userInitials, setUserInitials] = useState("SM");
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [
    isChangePasswordSuccessModalOpen,
    setIsChangePasswordSuccessModalOpen,
  ] = useState(false);

  const toggleDetailsModal = () => {
    setIsDetailsModalOpen(!isDetailsModalOpen);
  };
  const toggleChangePasswordModal = () => {
    setIsChangePasswordModalOpen(!isChangePasswordModalOpen);
  };
  const toggleChangePasswordSuccessModal = () => {
    setIsChangePasswordSuccessModalOpen(!isChangePasswordSuccessModalOpen);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleEditProfileDetailsModal = () => {
    toggleDetailsModal();
    toggleModal();
  };

  const handleChangePasswordModal = () => {
    toggleChangePasswordModal();
    toggleModal();
  };

  const handleChangePasswordSuccessModal = () => {
    toggleChangePasswordSuccessModal();
  };

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<{
          id: string;
          firstname: string;
          lastname: string;
          email: string;
          googleId: string;
        }>(token);
        setUserInfo(decoded);
        const initials = `${decoded.firstname[0]}${decoded.lastname[0]}`;
        setUserInitials(initials.toUpperCase());
      } catch (error) {
        console.error("Failed to decode JWT:", error);
      }
    }
  }, [token]);

  return (
    <>
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Profile</h1>
        <div className="w-full border border-gray-200 rounded-lg p-4 flex items-center">
          <button className="bg-yellow-400 cursor-auto text-lg text-white font-bold w-16 h-16 rounded-full mr-4">
            {userInitials}
          </button>
          <div className="flex-1">
            <div className="font-semibold">
              {userInfo?.firstname} {userInfo?.lastname}
            </div>
            <div className="text-gray-400">{userInfo?.email}</div>
          </div>
          <button
            className="bg-gray-50 text-black px-4 py-2 rounded-md flex items-center hover:bg-gray-100"
            onClick={() => setIsModalOpen(true)}
          >
            <img src={editUserImage} className="mr-2" />
            Edit
          </button>
        </div>
      </div>
      {isModalOpen && (
        <EditProfileModal
          isOpen={isModalOpen}
          onClose={toggleModal}
          userInfo={userInfo}
          userInitials={userInitials}
          handleEditProfileDetailsModal={handleEditProfileDetailsModal}
          handleChangePasswordModal={handleChangePasswordModal}
        />
      )}

      {isDetailsModalOpen && (
        <EditProfileDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={toggleDetailsModal}
          userInfo={userInfo}
          userInitials={userInitials}
        />
      )}
      {isChangePasswordModalOpen && (
        <EditPasswordModal
          isOpen={isChangePasswordModalOpen}
          onClose={toggleChangePasswordModal}
          userInfo={userInfo}
          handleChangePasswordSuccessModal={handleChangePasswordSuccessModal}
        />
      )}
      {isChangePasswordSuccessModalOpen && (
        <ChangePasswordSuccessModal
          isOpen={isChangePasswordSuccessModalOpen}
          onClose={toggleChangePasswordSuccessModal}
        />
      )}
    </>
  );
};

export default ProfileDashboard;
