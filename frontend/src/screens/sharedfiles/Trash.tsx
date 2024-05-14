import React from "react";
import { useSelector } from "react-redux";
import emptyTrashImage from "../../assets/images/empty-trash.svg";
import { selectFiles } from "../../reducers/file/fileSlice";
import RecentFiles from "../overview/RecentFiles";

const Trash: React.FC = () => {
  const files = useSelector(selectFiles);

  const deletedFiles = files.filter((file) => file.isDeleted);

  return (
    <>
      <div className="bg-white rounded-md border-2 border-gray-200 mt-2 min-h-screen">
        <h1 className="text-lg text-gray-600 font-semibold pl-4 mt-8">Trash</h1>
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-12">
            <img
              src={emptyTrashImage}
              alt="Empty Trash"
              className="max-w-xs mb-4"
            />
            <h2 className="text-xl font-semibold">Your Trash is Empty</h2>
            <p className="text-center text-sm mt-2 max-w-lg text-gray-400">
              It looks like there's nothing here! <br />
              If you no longer need certain items, move them to the trash.{" "}
              <br />
              Remember, items in the trash will be deleted permanently after 30
              days.
            </p>
          </div>
        ) : (
          <>
            <RecentFiles tagFiles={deletedFiles} />
          </>
        )}
      </div>
    </>
  );
};

export default Trash;
