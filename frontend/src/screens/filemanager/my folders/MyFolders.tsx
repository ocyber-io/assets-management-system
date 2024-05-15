import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { BsFillFolderFill, BsX } from "react-icons/bs"; // Import the delete (cross) icon
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DeleteFolderModal from "../../../components/shared/DeleteFolderModal";
import { selectFolders } from "../../../reducers/folder/folderSlice";
import { getFoldersByUserId } from "../../../reducers/folder/folderThunk";
import { AppDispatch } from "../../../stores/store";

const MyFolders: React.FC = () => {
  const navigate = useNavigate();
  const folders = useSelector(selectFolders);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch<AppDispatch>();
  const [folderId, setFolderId] = useState<string | null>("");
  const [userId, setUserId] = useState<string>();
  const [showDeleteFolderModal, setShowDeleteFolderModal] =
    useState<boolean>(false);

  const toggleDeleteFolderModal = () => {
    setShowDeleteFolderModal(!showDeleteFolderModal);
  };

  const deleteHandler = (folderId: string) => {
    toggleDeleteFolderModal();
    setFolderId(folderId);
  };

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<{
          id: string;
        }>(token);
        if (decoded) {
          setUserId(decoded.id);
        }
      } catch (error) {
        console.error("Failed to decode JWT:", error);
      }
    }
  }, [token]);

  useEffect(() => {
    const fetchFolders = async () => {
      if (userId) {
        try {
          await dispatch(getFoldersByUserId(userId));
        } catch (error) {
          console.error("Error fetching folders:", error);
        }
      }
    };
    fetchFolders();
  }, [dispatch, userId]);

  const folderHandler = (folderId: string) => {
    navigate(`/folders/${folderId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Folders</h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {folders &&
          folders.map((folder) => (
            <>
              <div
                key={folder._id}
                className="relative" // Make the container relative to position the delete button
              >
                <button
                  className="absolute top-1 right-1 p-1 rounded-full bg-transparent hover:bg-gray-200"
                  onClick={() => deleteHandler(folder._id)}
                  aria-label="Delete folder"
                >
                  <BsX size={18} color="#888" />
                </button>
                <div
                  className="flex flex-col items-center p-6 border border-gray-200 rounded-lg  cursor-pointer"
                  style={{ backgroundColor: `${folder.folderColor}10` }}
                  onClick={() => folderHandler(folder._id)}
                >
                  <BsFillFolderFill
                    size={64}
                    color={folder.folderColor}
                    className="opacity-85"
                  />
                  <span className="mt-4 text-xl font-semibold text-gray-700">
                    {folder.folderName}
                  </span>
                </div>
              </div>
            </>
          ))}
      </div>
      {showDeleteFolderModal && (
        <DeleteFolderModal
          heading="Delete Folder?"
          description="Do you really want to delete this folder? You cannot restore it later"
          submitButtonText="Yes, Delete"
          onClose={toggleDeleteFolderModal}
          folderId={folderId}
          isOpen={showDeleteFolderModal}
        />
      )}
    </div>
  );
};

export default MyFolders;
