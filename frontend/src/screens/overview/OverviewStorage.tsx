import React from "react";
import { storageItems } from "../../helpers/storageItems";

// Define the type for the items in storageItems
type StorageItem = {
  id: number;
  icon: string;
  fileType: string;
  itemCount: string;
  usedSpace: string;
  usedGB: number;
  totalGB: number;
  progressBarColor: string;
};

// Helper function to convert hex color to RGBA with desired opacity
const hexToRGBA = (hex: string, opacity: number): string => {
  let r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const OverviewStorage: React.FC = () => {
  return (
    <div className="px-8 py-3">
      <h2 className="text-2xl font-bold mb-6">Overview Storage</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4">
        {storageItems.map((item: StorageItem) => {
          const progressPercentage = `${(item.usedGB / item.totalGB) * 100}%`;
          const cardBackgroundColor = hexToRGBA(item.progressBarColor, 0.1); // Convert color to RGBA with 10% opacity
          const progressBarBackgroundColor = hexToRGBA(
            item.progressBarColor,
            0.2
          ); // Convert color to RGBA with 20% opacity

          return (
            <div
              key={item.id}
              className="rounded-lg"
              style={{ backgroundColor: cardBackgroundColor }} // Apply dynamic background color
            >
              <div className="p-4 flex items-center">
                <div
                  style={{ backgroundColor: item.progressBarColor }}
                  className="rounded-md p-2 mr-3"
                >
                  <img
                    src={item.icon}
                    alt={item.fileType}
                    className="h-8 w-8"
                  />
                </div>
                <div>
                  <h3 className="text-md font-semibold">{item.fileType}</h3>
                  <p className="text-sm text-gray-500 font-semibold">
                    {item.itemCount}
                  </p>
                </div>
              </div>
              <div className="px-4">
                <div
                  className="w-full h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: progressBarBackgroundColor }}
                >
                  <div
                    style={{
                      width: progressPercentage,
                      backgroundColor: item.progressBarColor,
                      height: "100%",
                    }}
                    className="rounded-full"
                  ></div>
                </div>
                <p className="font-semibold mt-3 pb-5 text-gray-700">
                  {item.usedSpace}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OverviewStorage;
