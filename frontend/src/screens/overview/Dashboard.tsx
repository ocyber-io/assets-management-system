import React, { useState } from "react";
import OverviewTopBar from "./OverviewTopBar";
import OverviewStorage from "./OverviewStorage";
import RecentStorage from "./RecentStorage";
import RecentFiles from "./RecentFiles";
import { selectFiles } from "../../reducers/file/fileSlice";
import { useSelector } from "react-redux";

const Dashboard: React.FC = () => {
  const [isSorted, setIsSorted] = useState(false);

  const toggleSort = () => {
    setIsSorted(!isSorted);
  };

  const sortHandler = () => {
    toggleSort();
  };

  const files = useSelector(selectFiles);
  let undeletedFiles = files.filter((file) => !file.isDeleted);

  // Sort undeleted files if isSorted is true
  if (isSorted) {
    undeletedFiles = undeletedFiles.sort((a, b) => {
      // Assuming you want to sort by file name
      return b.createdAt.localeCompare(a.createdAt);
    });
  }

  return (
    <div className="bg-white rounded-lg md:border-2 md:border-gray-200 mt-2">
      <div>
        <OverviewTopBar
          isSorted={isSorted}
          sortHandler={sortHandler}
          heading="Overview"
        />
      </div>
      <div>
        <OverviewStorage files={undeletedFiles} />
      </div>
      <div>
        <RecentStorage />
      </div>
      <div>
        <h2 className="text-2xl ml-3 md:ml-8 font-bold my-4">Recent Files</h2>

        <RecentFiles files={undeletedFiles} filesPerPage={6} />
      </div>
    </div>
  );
};

export default Dashboard;
