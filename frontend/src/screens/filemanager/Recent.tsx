import React from "react";
import OverviewTopBar from "../overview/OverviewTopBar"; // Convert OverviewTopBar to TSX if needed
import RecentFiles from "../overview/RecentFiles"; // Make sure RecentTable is also converted to TSX if needed
import { selectFiles } from "../../reducers/file/fileSlice";
import { useSelector } from "react-redux";

const Recent: React.FC = () => {
  const files = useSelector(selectFiles);
  const undeletedFiles = files.filter((file) => !file.isDeleted);

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 mt-2 overflow-x-hidden">
      <OverviewTopBar heading="Recent Files" />
      <RecentFiles
        files={undeletedFiles}
        filesPerPage={8}
        fullScreenList={true}
      />
    </div>
  );
};

export default Recent;
