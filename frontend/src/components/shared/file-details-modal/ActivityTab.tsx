import React, { useState } from "react";
import { FiChevronDown, FiFile } from "react-icons/fi";
import { downRightArrowIcon, pdfSmallIcon } from "../../../helpers/icons";

interface ActivityProps {
  timePeriod: string;
  activities?: Activity[];
}

interface Activity {
  description: string;
  date: string;
}

const ActivityItem: React.FC<Activity> = ({ description, date }) => (
  <div className="flex items-center space-x-3">
    <img
      src="https://via.placeholder.com/50"
      alt="user"
      className="w-10 h-10 rounded-full"
    />
    <div>
      <p>{description}</p>
      <p className="text-xs text-gray-500">{date}</p>
    </div>
  </div>
);

const CollapsibleSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="">
      <button
        className="flex items-center space-x-2 text-sm bg-gray-50 rounded px-2 ml-12 mt-2 py-1 border-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiChevronDown
          className={`mr-1 w-5 h-5 ${
            isOpen ? "transform rotate-180 text-blue-500" : ""
          }`}
        />
        My Drive
      </button>
      {isOpen && (
        <div className="pl-4 mt-2">
          <button className="flex items-center space-x-2 ml-10">
            <img src={downRightArrowIcon} />
            <div className="border-2  border-gray-200 text-sm bg-gray-50 flex px-2 py-1 rounded">
              <img src={pdfSmallIcon} className=" mr-2" />
              <span>ExampleFile.docx</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

const TimePeriodActivities: React.FC<ActivityProps> = ({
  timePeriod,
  activities,
}) => {
  if (!activities || activities.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h3 className="font-semibold">{timePeriod}</h3>
      {activities.map((activity, index) => (
        <ActivityItem key={index} {...activity} />
      ))}
      <CollapsibleSection />
    </div>
  );
};

export const ActivityTab: React.FC = () => {
  const activitiesData = {
    lastYear: [
      { description: "You uploaded an item", date: "December 25, 2022" },
    ],
    lastMonth: [],
    lastWeek: [{ description: "You uploaded an item", date: "April 1, 2024" }],
  };

  return (
    <div className="p-1 mx-2">
      <TimePeriodActivities
        timePeriod="Last Year"
        activities={activitiesData.lastYear}
      />
      <TimePeriodActivities
        timePeriod="Last Month"
        activities={activitiesData.lastMonth}
      />
      <TimePeriodActivities
        timePeriod="Last Week"
        activities={activitiesData.lastWeek}
      />
    </div>
  );
};
