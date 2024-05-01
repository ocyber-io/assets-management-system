import React from "react";
import OverviewTopBar from "./OverviewTopBar";
import OverviewStorage from "./OverviewStorage";
import RecentStorage from "./RecentStorage";
import RecentFiles from "./RecentFiles";
import { files } from "../../helpers/sampleTableData";

const Dashboard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg md:border-2 md:border-gray-200 mt-2">
      <div>
        <OverviewTopBar />
      </div>
      <div>
        <OverviewStorage />
      </div>
      <div>
        <RecentStorage />
      </div>
      <div>
        <h2 className="text-2xl ml-3 font-bold my-4">Recent Files</h2>

        <RecentFiles files={files} filesPerPage={6} />
      </div>
    </div>
  );
};

export default Dashboard;
