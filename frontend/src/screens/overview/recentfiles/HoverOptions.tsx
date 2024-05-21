import React from "react";
import { File } from "../../../Types"; // Assuming this is the type definition for your files
import {
  EnableIcon,
  disableIcon,
  downloadIcon,
  movetobinIcon,
  renameIcon,
  restoreIcon,
  shareIcon,
  starredIcon,
  unstarIcon,
} from "../../../helpers/dropdownIcons";
import { removeFromFolderIcon } from "../../../helpers/icons";

interface HoverOptionsProps {
  file: File;

  hoveredItemId: string | null;
  renameHandler: (filename: string, fileId: string) => void;
  deleteHandler: (fileId: string) => void; // Assuming you need the file ID for deletion
  disableHandler: (fileId: string) => void;
  enableHandler: (fileId: string) => void;
  removeFromFolderHandler: (fileId: string) => void;
  shareHandler: (fileLink: string) => void;
  deleteConfirmationHandler: (fileId: string) => void;
  restoreHandler: (fileId: string, filename: string, filesize: string) => void;
  toggleFavoriteFiles: (
    fileId: string,
    isFavorite: boolean | undefined
  ) => void;
  fromTrash?: boolean;
  fromFavorites?: boolean;
  fromFolders?: boolean;
}

const HoverOptions: React.FC<HoverOptionsProps> = ({
  file,
  hoveredItemId,
  renameHandler,
  deleteHandler,
  disableHandler,
  shareHandler,
  enableHandler,
  fromTrash,
  deleteConfirmationHandler,
  restoreHandler,
  toggleFavoriteFiles,
  fromFolders,
  removeFromFolderHandler,
}) => {
  const downloadHandler = () => {
    if (file.link) {
      const link = document.createElement("a");
      link.href = file.link; // Assuming `file.link` is the URL to download the file
      link.setAttribute("download", file.originalName); // This suggests a filename to save as
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  return (
    <div
      className={`flex gap-x-1 xl:mt-2  ${
        fromFolders ? "md:mr-12" : "md:mr-8"
      } ${hoveredItemId === file._id ? "visible" : "invisible"}`}
    >
      {!fromTrash && (
        <>
          <img
            src={shareIcon}
            className={`ml-6  ${
              file.isDisabled ? "opacity-30" : "cursor-pointer"
            }`}
            alt="Share"
            onClick={() => {
              if (!file.isDisabled) shareHandler(file.link);
            }}
          />
          <img
            src={downloadIcon}
            className={`ml-4 ${
              file.isDisabled ? "opacity-30" : "cursor-pointer"
            }`}
            alt="Download"
            onClick={() => {
              if (!file.isDisabled) downloadHandler();
            }}
          />
          <img
            src={renameIcon}
            className={`ml-4 ${
              file.isDisabled ? "opacity-30" : "cursor-pointer"
            }`}
            alt="Rename"
            onClick={() => {
              if (!file.isDisabled) renameHandler(file.originalName, file._id);
            }}
          />
          {!file.isFavorite ? (
            <img
              src={starredIcon}
              className={`ml-4 ${
                file.isDisabled ? "opacity-30" : "cursor-pointer"
              }`}
              alt="Star"
              onClick={() => toggleFavoriteFiles(file._id, file.isFavorite)}
            />
          ) : (
            <img
              src={unstarIcon}
              className={`ml-4 ${
                file.isDisabled ? "opacity-30" : "cursor-pointer"
              }`}
              alt="Star"
              onClick={() => toggleFavoriteFiles(file._id, file.isFavorite)}
            />
          )}
        </>
      )}
      {fromFolders && (
        <img
          src={removeFromFolderIcon}
          className="ml-4 cursor-pointer opacity-60"
          alt="removeFromFolder"
          onClick={() => {
            removeFromFolderHandler(file._id);
          }}
        />
      )}
      {fromTrash && (
        <img
          src={restoreIcon}
          className="ml-4 cursor-pointer"
          alt="Restore"
          onClick={() => {
            restoreHandler(file._id, file.originalName, file.size);
          }}
        />
      )}
      {fromTrash ? (
        <img
          src={movetobinIcon}
          className="ml-4 cursor-pointer"
          alt="Move to bin"
          onClick={() => {
            deleteConfirmationHandler(file._id);
          }}
        />
      ) : (
        <img
          src={movetobinIcon}
          className="ml-4 cursor-pointer"
          alt="Move to bin"
          onClick={() => {
            deleteHandler(file._id);
          }}
        />
      )}

      {!fromTrash && (
        <>
          {file.isDisabled ? (
            <>
              <img
                src={EnableIcon}
                className="ml-4 cursor-pointer"
                alt="Enable"
                onClick={() => {
                  enableHandler(file._id);
                }}
              />
            </>
          ) : (
            <>
              <img
                src={disableIcon}
                className="ml-4 cursor-pointer"
                alt="Disable"
                onClick={() => {
                  disableHandler(file._id);
                }}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default HoverOptions;
