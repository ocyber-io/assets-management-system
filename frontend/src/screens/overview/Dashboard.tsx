import React, { useEffect, useState } from "react";
import OverviewTopBar from "./OverviewTopBar";
import OverviewStorage from "./OverviewStorage";
import RecentStorage from "./RecentStorage";
import RecentFiles from "./RecentFiles";
import { selectFiles } from "../../reducers/file/fileSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectKeyword,
  selectSearchResults,
  setKeyword,
} from "../../reducers/search/searchSlice";

const Dashboard: React.FC = () => {
  const [isSorted, setIsSorted] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchResults = useSelector(selectSearchResults);
  const keyword = useSelector(selectKeyword);
  const files = useSelector(selectFiles);

  useEffect(() => {
    // Dispatch an action to set the keyword to empty when component unmounts
    return () => {
      dispatch(setKeyword(""));
    };
  }, [dispatch]);

  const toggleSort = () => {
    setIsSorted(!isSorted);
  };

  const sortHandler = () => {
    toggleSort();
  };

  const renderContent = () => {
    if (keyword && searchResults.length > 0) {
      return (
        <div className="bg-white rounded-lg shadow-md p-4 mt-4">
          <h2 className="text-xl font-bold mb-2">Search Results</h2>
          <p className="text-gray-400 mb-4">Showing results for: {keyword}</p>
          <RecentFiles files={searchResults} filesPerPage={8} />
        </div>
      );
    } else {
      return (
        <>
          <OverviewTopBar
            isSorted={isSorted}
            sortHandler={sortHandler}
            heading="Overview"
          />
          <OverviewStorage files={files.filter((file) => !file.isDeleted)} />
          <RecentStorage />
          <div className="flex justify-between w-full">
            <h2 className="text-2xl ml-3 md:ml-8 font-bold my-4">
              Recent Files
            </h2>
            <button
              className="text-blue-500 text-sm font-medium hover:underline pr-8"
              onClick={() => navigate("/recent")}
            >
              View All
            </button>
          </div>
          <RecentFiles
            files={files.filter((file) => !file.isDeleted)}
            filesPerPage={6}
            fromDashboard={true}
          />
        </>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg md:border-2 md:border-gray-200 mt-2">
      {renderContent()}
    </div>
  );
};

export default Dashboard;
