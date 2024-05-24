import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { File } from "../../../Types";
import { downRightArrowIcon, pdfSmallIcon } from "../../../helpers/icons";
import { useUser } from "../../hooks/useUserDetails";

interface ActivityProps {
  timePeriod: string;
  activities?: Activity[];
  userInitials: string; // Add userInitials to ActivityProps
}

type ActivityTabProps = {
  file: File | undefined;
};

interface Activity {
  description: string;
  date: string;
}

type FilesArray = File[] | undefined;

const ActivityItem: React.FC<Activity & { userInitials: string }> = (
  { date, userInitials } // Add userInitials prop here
) => (
  <div className="flex items-center space-x-3 mt-4">
    <button className="bg-yellow-400 text-white h-8 w-8 rounded-full text-sm">
      {userInitials}
    </button>
    <div>
      <p>You uploaded an item</p>
      <p className="text-xs text-gray-500">{date}</p>
    </div>
  </div>
);

const CollapsibleSection: React.FC<{
  activity: Activity & { userInitials: string };
}> = ({ activity }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    // Add userInitials prop here
    <div className="">
      <ActivityItem {...activity} />
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
          {/* Include ActivityItem here */}
          <button className="flex items-center space-x-2 ml-8">
            <img src={downRightArrowIcon} />
            <div className="border-2 border-gray-200 text-sm bg-gray-50 flex px-2 py-1 rounded">
              <img src={pdfSmallIcon} className=" mr-2" />
              <span>{activity.description}</span>
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
  userInitials, // Receive userInitials here
}) => {
  if (!activities || activities.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h3 className="font-semibold">{timePeriod}</h3>
      {activities.map((activity, index) => (
        <div key={index}>
          <CollapsibleSection
            activity={{
              ...activity,
              description: `${activity.description.slice(
                0,
                8
              )}...${activity.description.slice(-5)}`,
              userInitials: userInitials, // Pass userInitials to CollapsibleSection
            }}
          />
        </div>
      ))}
    </div>
  );
};

export const ActivityTab: React.FC<ActivityTabProps> = ({ file }) => {
  const today: Date = new Date();
  const {userInitials} = useUser();

  // Define arrays for last week, last month, and last year
  const lastWeek: FilesArray = [];
  const lastMonth: FilesArray = [];
  const lastYear: FilesArray = [];
  const currentMonth: number = today.getMonth() + 1; // January is 0, so adding 1

  if (file) {
    // Check if file is defined
    const createdAt = new Date(file.createdAt);
    const timeDiff: number = today.getTime() - createdAt.getTime();
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

    if (daysDiff <= 7) {
      lastWeek.push(file);
    } else if (
      createdAt.getFullYear() === today.getFullYear() && // Same year
      createdAt.getMonth() + 1 === currentMonth - 1 // Previous month
    ) {
      lastMonth.push(file);
    } else if (createdAt.getFullYear() === 2023) {
      lastYear.push(file);
    }
  }

  return (
    <div className="p-1 mx-2">
      <TimePeriodActivities
        timePeriod="Last Year"
        activities={lastYear.map((file) => ({
          description: file.originalName,
          date: new Date(file.createdAt).toDateString(),
        }))}
        userInitials={userInitials} // Pass userInitials to TimePeriodActivities
      />
      <TimePeriodActivities
        timePeriod="Last Month"
        activities={lastMonth.map((file) => ({
          description: file.originalName,
          date: new Date(file.createdAt).toDateString(),
        }))}
        userInitials={userInitials} // Pass userInitials to TimePeriodActivities
      />
      <TimePeriodActivities
        timePeriod="Last Week"
        activities={lastWeek.map((file) => ({
          description: file.originalName,
          date: new Date(file.createdAt).toDateString(),
        }))}
        userInitials={userInitials} // Pass userInitials to TimePeriodActivities
      />
    </div>
  );
};
