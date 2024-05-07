import React, { useEffect, useState } from "react";
import editProfileImage from "../../assets/images/edit-profile.svg";
import editUserImage from "../../assets/icons/editUsers.svg";
import EditProfileModal from "./EditProfileModal";
import Breadcrumbs from "../../components/Breadcrumbs";
import { jwtDecode } from "jwt-decode";

type UserInfo = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  googleId: string;
};

const Profile: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [userInitials, setUserInitials] = useState("SM");
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const token = localStorage.getItem("token");

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
      <Breadcrumbs />

      <h1 className="text-xl font-semibold w-full text-center sm:text-left sm:w-auto md:ml-4">
        Profile
      </h1>

      <div className="bg-white rounded-lg border-2 border-gray-200 w-full max-w-lg mt-8 md:ml-4">
        <div className="bg-blue-50 rounded-t-lg flex justify-end">
          <img src={editProfileImage} alt="Edit Profile" className="md:mr-6" />
        </div>
        <div className="flex justify-start -mt-8 ml-6">
          <button className="bg-yellow-400 text-white font-bold p-4 rounded-full">
            {userInitials}
          </button>
        </div>
        <div className="p-4 mt-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <label className="flex flex-col w-full font-semibold ">
              First Name
              <input
                type="text"
                value={userInfo?.firstname}
                placeholder="Paul"
                disabled
                className="border-2 p-2 rounded w-full mt-1 border-gray-200 focus:outline-blue-500"
              />
            </label>
            <label className="flex flex-col w-full font-semibold mb-1">
              Last Name
              <input
                type="text"
                value={userInfo?.lastname}
                placeholder="Walker"
                disabled
                className="border-2 p-2 rounded w-full mt-1 border-gray-200 focus:outline-blue-500"
              />
            </label>
          </div>
          <label className="flex flex-col w-full font-semibold mb-1">
            Email
            <input
              disabled
              type="email"
              value={userInfo?.email}
              placeholder="example@email.com"
              className="border-2 p-2 rounded w-full mt-1 border-gray-200 focus:outline-blue-500"
            />
          </label>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white mt-8 w-full py-3 rounded flex items-center justify-center"
            onClick={openModal}
          >
            <img src={editUserImage} alt="Edit User" className="mr-2" />
            Edit User
          </button>
        </div>
      </div>
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={closeModal}
        userInfo={userInfo}
      />
    </>
  );
};

export default Profile;
