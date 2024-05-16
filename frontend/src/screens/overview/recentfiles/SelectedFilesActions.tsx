import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import {
  disableIcon,
  downloadIcon,
  moreIcon,
  movetobinIcon,
  renameIcon,
  selectAllIcon,
  shareIcon,
  starredIcon,
  unstarIcon,
} from "../../../helpers/dropdownIcons";
import { SelectedFile } from "../../../Types";
import { AppDispatch } from "../../../stores/store";
import { useDispatch } from "react-redux";
import {
  fetchFiles,
  toggleMultipleFilesFavorite,
} from "../../../reducers/file/fileThunks";
import { showErrorToast, showSuccessToast } from "../../../utils/toast";
import { jwtDecode } from "jwt-decode";

interface SelectedFilesActionsProps {
  selectedFilesCount: number;
  deselectAll: () => void;
  selectAll: () => void;
  selectedFiles: SelectedFile[];
  fromFavorites?: boolean;
}

const SelectedFilesActions: React.FC<SelectedFilesActionsProps> = ({
  selectedFilesCount,
  deselectAll,
  selectAll,
  selectedFiles,
  fromFavorites,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = localStorage.getItem("token");
  const [userId, setUserId] = useState<string>();

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

  const fetchFileDetails = () => {
    if (userId) dispatch(fetchFiles(userId));
  };

  if (selectedFilesCount === 0) {
    return null;
  }

  const downloadHandler = (files: SelectedFile[]) => {
    console.log(files);

    if (files.length === 0) {
      return;
    } else {
      files.forEach((file) => {
        const link = document.createElement("a");
        link.href = file.id;
        link.setAttribute("download", file.originalName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  };

  const handleMultipleFavorites = async (files: SelectedFile[]) => {
    try {
      // Filter files where isFavorite is not already true, then extract their IDs
      const fileIds = files
        .filter((file) => !file.isFavorite) // Filter out files where isFavorite is already true
        .map((file) => file.id); // Extract the IDs of remaining files

      if (fileIds.length === 0 && files.length === 0) {
        showErrorToast("No Files were selcted");
        return;
      } else if (files.length > 0 && fileIds.length === 0) {
        showErrorToast("Files already added to favorites");
        return;
      }
      await dispatch(toggleMultipleFilesFavorite(fileIds)).unwrap();
      showSuccessToast(
        `${fileIds.length} file${
          fileIds.length > 1 ? "s" : ""
        } marked as favorite`
      );
      fetchFileDetails();
      deselectAll();
    } catch (error: any) {
      showErrorToast("Error handling multiple favorites");
    }
  };

  const handleRemoveMultipleFavorites = async (files: SelectedFile[]) => {
    try {
      const fileIds = files.map((file) => file.id);
      await dispatch(toggleMultipleFilesFavorite(fileIds)).unwrap();
      showSuccessToast(
        `${fileIds.length} file${
          fileIds.length > 1 ? "s" : ""
        } removed from favorites`
      );
      fetchFileDetails();
      deselectAll();
    } catch (error: any) {
      showErrorToast("Error handling multiple favorites");
    }
  };

  return (
    <div className="flex bg-blue-50 p-2 rounded w-full">
      <div className="flex w-full">
        <div className="p-1">
          <RxCross1
            onClick={deselectAll}
            className="cursor-pointer ml-2 mr-4 mt-1 md:h-4 h-3 md:w-4 w-3"
          />
        </div>
        <span className="ml-1 md:mt-0.5 mt-1 font-semibold md:text-base text-xs whitespace-nowrap">
          {selectedFilesCount} Selected
        </span>
        <img
          src={shareIcon}
          className={`ml-6  ${
            selectedFilesCount > 1 ? "hidden" : "cursor-pointer"
          }`}
          alt="Share"
          onClick={
            selectedFilesCount === 1 ? () => console.log("Share") : undefined
          }
        />
        <img
          src={downloadIcon}
          className="ml-4 cursor-pointer"
          alt="Download"
          onClick={() => {
            downloadHandler(selectedFiles);
          }}
        />
        <img
          src={renameIcon}
          className={`ml-4  ${
            selectedFilesCount > 1 ? "hidden" : "cursor-pointer"
          }`}
          alt="Rename"
          onClick={
            selectedFilesCount === 1 ? () => console.log("Rename") : undefined
          }
        />
        <div className="md:visible flex invisible">
          {fromFavorites ? (
            <img
              src={unstarIcon}
              className="ml-4 cursor-pointer"
              alt="Star"
              onClick={() => handleRemoveMultipleFavorites(selectedFiles)}
            />
          ) : (
            <img
              src={starredIcon}
              className="ml-4 cursor-pointer"
              alt="Star"
              onClick={() => handleMultipleFavorites(selectedFiles)}
            />
          )}

          <img
            src={movetobinIcon}
            className="ml-4 cursor-pointer"
            alt="Move to bin"
          />
          <img
            src={disableIcon}
            className="ml-4 cursor-pointer"
            alt="Disable"
          />
        </div>
      </div>
      <div className="flex">
        <img
          src={selectAllIcon}
          className="md:ml-4 mx-2 cursor-pointer"
          alt="Select All"
          onClick={selectAll} // Add onClick handler here
        />
        <img
          src={moreIcon}
          className="md:ml-4 mx-2 cursor-pointer"
          alt="More"
        />
      </div>
    </div>
  );
};

export default SelectedFilesActions;
