import React from "react";
import RecentFiles from "../overview/RecentFiles"; // Make sure RecentTable is also converted to TSX if needed
import OverviewTopBar from "../overview/OverviewTopBar"; // Convert OverviewTopBar to TSX if needed
import { files } from "../../helpers/sampleTableData";

const Recent: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 mt-2 overflow-x-hidden">
      <OverviewTopBar heading="Recent Files" />
      <RecentFiles files={files} fullScreenList={true} />
    </div>
  );
};

export default Recent;
