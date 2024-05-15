import React, { useState } from "react";
import OverviewTopBar from "../overview/OverviewTopBar"; // Convert OverviewTopBar to TSX if needed
import RecentFiles from "../overview/RecentFiles"; // Make sure RecentTable is also converted to TSX if needed
import { selectFiles } from "../../reducers/file/fileSlice";
import { useSelector } from "react-redux";

const Recent: React.FC = () => {
  const files = useSelector(selectFiles);
  let undeletedFiles = files.filter((file) => !file.isDeleted);

  const [isSorted, setIsSorted] = useState(false);

  const toggleSort = () => {
    setIsSorted(!isSorted);
  };

  const sortHandler = () => {
    toggleSort();
  };

  if (isSorted) {
    undeletedFiles = undeletedFiles.sort((a, b) => {
      // Assuming you want to sort by file name
      return b.createdAt.localeCompare(a.createdAt);
    });
  }

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 mt-2 overflow-x-hidden">
      <OverviewTopBar
        heading="Recent Files"
        isSorted={isSorted}
        sortHandler={sortHandler}
      />
      <RecentFiles
        files={undeletedFiles}
        filesPerPage={8}
        fullScreenList={true}
      />
    </div>
  );
};

export default Recent;
