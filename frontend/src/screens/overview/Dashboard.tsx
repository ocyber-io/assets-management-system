import React from "react";
import OverviewTopBar from "./OverviewTopBar";
import OverviewStorage from "./OverviewStorage";
import RecentStorage from "./RecentStorage";
import RecentFiles from "./RecentFiles";

const Dashboard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 mt-2">
      <div>
        <OverviewTopBar heading="Overview" />
      </div>
      <div>
        <OverviewStorage />
      </div>
      <div>
        <RecentStorage />
      </div>
      <div>
        <RecentFiles filesPerPage={6} />
      </div>
    </div>
  );
};

export default Dashboard;
