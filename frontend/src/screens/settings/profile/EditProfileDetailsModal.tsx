import React, { useState, useRef, useEffect } from "react";
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
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<
    string | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (profilePicture) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(profilePicture);
    } else {
      setProfilePicturePreview(null);
    }
  }, [profilePicture]);

  const handleUpdate = async () => {
    if (error) {
      showErrorToast(error);
      return;
    }
  
    try {
      if (profilePicture) {
        // If profile picture exists, update it separately
        const picturePayload = new FormData();
        picturePayload.append("file", profilePicture);
        await dispatch(
          updateUser({
            id: userInfo!.id,
            updates: picturePayload,
          })
        ).unwrap();
        window.location.reload();
      }
  
      // Construct payload for other details
      const detailsPayload = {
        firstname: firstName,
        lastname: lastName,
        email: email,
      };
  
      // Update other details if there are changes
      if (Object.keys(detailsPayload).length > 0) {
        await dispatch(
          updateUser({
            id: userInfo!.id,
            updates: detailsPayload,
          })
        ).unwrap();
      }
  
      showSuccessToast("Profile updated successfully");
      onClose();
    } catch (error: any) {
      showErrorToast("Error updating profile: " + error.message);
    }
  };
  
  
  

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        setProfilePicture(null);
      } else {
        setError(null);
        setProfilePicture(file);
      }
    }
  };

  const openFileInput = () => {
    fileInputRef.current?.click();
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
          {profilePicturePreview ? (
            <div className="w-24 h-24 rounded-lg border-2 border-white mr-4 cursor-pointer absolute left-9 -bottom-12">
              <img
                src={profilePicturePreview}
                className="w-24 h-24 rounded-lg object-cover"
              />
            </div>
          ) : userInfo &&
            userInfo.profilePicture !== "" &&
            userInfo.profilePicture !== undefined ? (
            <div className="w-24 h-24 rounded-lg border-2 border-white mr-4 cursor-pointer absolute left-9 -bottom-12">
              <img
                src={`/uploads/${userInfo.id}/${userInfo.profilePicture}`}
                className="w-24 h-24 rounded-lg object-cover"
              />
            </div>
          ) : (
            <button className="bg-yellow-400 cursor-auto text-4xl text-white rounded-lg font-bold w-24 h-24 border-2 border-white absolute left-9 -bottom-12">
              {userInitials}
            </button>
          )}
          <button
            onClick={openFileInput}
            className="bg-transparent text-blue-600 absolute left-36"
          >
            Change Image
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleImageChange}
          />
          {error && (
            <div className="text-red-500 text-sm mt-1 absolute left-36 top-16">
              {error}
            </div>
          )}
        </div>
        <div className="p-6">
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
              className="bg-transparent border w-full text-black py-2 rounded hover:bg-gray-50"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 w-full text-white py-3 rounded hover:bg-blue-600"
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
