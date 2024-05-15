import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { BsFillFolderFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import binIcon from "../../../assets/icons/dropdown/movetobin.svg";
import DeleteFolderModal from "../../../components/shared/DeleteFolderModal";
import { selectFolders } from "../../../reducers/folder/folderSlice";
import { getFoldersByUserId } from "../../../reducers/folder/folderThunk";
import { AppDispatch } from "../../../stores/store";
import { formatDate } from "../../../utils/helpers";

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
    <div className="">
      <h1 className="text-lg px-6 pt-4 font-bold mb-6 text-gray-800">
        My Folders
      </h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
              Folder Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
              Created At
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
              Modified At
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
              Files
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4"></th>
          </tr>
        </thead>
        <tbody className=" divide-y divide-gray-200">
          {folders &&
            folders.map((folder) => (
              <tr key={folder._id}>
                <td
                  className="px-6 py-4 whitespace-nowrap cursor-pointer"
                  onClick={() => folderHandler(folder._id)}
                >
                  <div className="flex items-center">
                    <div className="">
                      <BsFillFolderFill
                        size={24}
                        color={folder.folderColor}
                        className="opacity-85"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-lg font-semibold text-gray-700">
                        {folder.folderName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(folder.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(folder.updatedAt)}
                </td>
                <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-500">
                  {folder.files.length}
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => deleteHandler(folder._id)}
                    aria-label="Delete folder"
                  >
                    <img src={binIcon} className="mr-2 mt-0.5" alt="bin icon" />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
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
