import { saveAs } from "file-saver";
import JSZip from "jszip";
import React from "react";
import { RxCross1 } from "react-icons/rx";
import { useSelector } from "react-redux";
import {
  downloadIcon,
  moreIcon,
  movetobinIcon,
  restoreIcon,
  selectAllIcon,
} from "../../../helpers/dropdownIcons";
import { selectFolders } from "../../../reducers/folder/folderSlice";

interface SelectedFolderActionsProps {
  selectedFoldersCount: number;
  deselectAll: () => void;
  selectAll: () => void;
  deleteMultipleFoldersHandler: () => void;
  deleteMultipleFoldersConfirmationHandler: () => void;
  selectedFolders: string[];
  fromTrash?: boolean;
}

const SelectedFolderActions: React.FC<SelectedFolderActionsProps> = ({
  selectedFoldersCount,
  deselectAll,
  selectAll,
  selectedFolders,
  fromTrash,
  deleteMultipleFoldersHandler,
  deleteMultipleFoldersConfirmationHandler,
}) => {
  const folders = useSelector(selectFolders);
  const fetchFolderDetails = async (folderId: string) => {
    return folders.find((folder) => folder._id === folderId);
  };

  const handleDownload = async () => {
    const zip = new JSZip();

    const fetchFileContent = async (fileUrl: string) => {
      const response = await fetch(fileUrl);
      return await response.blob();
    };

    for (const folderId of selectedFolders) {
      const folder = await fetchFolderDetails(folderId);
      if (folder) {
        const folderZip = zip.folder(folder.folderName);
        const filePromises = folder.files.map(async (file) => {
          const fileContent = await fetchFileContent(file.fullLink);
          folderZip?.file(file.originalName, fileContent);
        });
        await Promise.all(filePromises);
      }
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "folders.zip");
    });
  };

  return (
    <>
      {selectedFoldersCount > 0 && (
        <div className="flex bg-blue-50 p-2 rounded w-full">
          <div className="flex w-full">
            <div className="p-1">
              <RxCross1
                onClick={deselectAll}
                className="cursor-pointer ml-2 mr-4 mt-1 md:h-4 h-3 md:w-4 w-3"
              />
            </div>
            <span className="ml-1 md:mt-0.5 mt-1 font-semibold md:text-base text-xs whitespace-nowrap">
              {selectedFoldersCount} Selected
            </span>
            <div className="flex bg-blue-50 p-2 rounded w-full">
              {!fromTrash && (
                <>
                  <img
                    src={downloadIcon}
                    className="ml-4 cursor-pointer"
                    alt="Download"
                    onClick={handleDownload}
                  />
                </>
              )}
              {fromTrash ? (
                <img
                  src={movetobinIcon}
                  className="ml-4 cursor-pointer"
                  alt="Move to bin"
                  onClick={deleteMultipleFoldersConfirmationHandler}
                />
              ) : (
                <img
                  src={movetobinIcon}
                  className="ml-4 cursor-pointer"
                  alt="Move to bin"
                  onClick={deleteMultipleFoldersHandler}
                />
              )}

              {fromTrash && (
                <img
                  src={restoreIcon}
                  className="ml-4 cursor-pointer"
                  alt="Restore folder"
                  onClick={() => {
                    // Handle Restore action
                  }}
                />
              )}
            </div>
          </div>
          <div className="flex">
            <img
              src={selectAllIcon}
              className="md:ml-4 mx-2 cursor-pointer"
              alt="Select All"
              onClick={selectAll}
            />
            <img
              src={moreIcon}
              className="md:ml-4 mx-2 cursor-pointer"
              alt="More"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SelectedFolderActions;
