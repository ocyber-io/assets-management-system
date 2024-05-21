import React from "react";
import { File } from "../../Types";
import docIcon from "../../assets/icons/overview-storage/doc.svg";
import otherIcon from "../../assets/icons/overview-storage/other.svg";
import jpgIcon from "../../assets/icons/overview-storage/photo.svg";
import videoIcon from "../../assets/icons/overview-storage/video.svg";
import { calculateStorageUsage } from "../../utils/helpers";

type OverViewStorageProps = {
  files?: File[] | undefined;
};
// Define the type for the items in storageItems
type StorageItem = {
  id: number;
  icon: string;
  fileType: string;
  itemCount: number;
  usedGB: number;
  totalGB: number;
  progressBarColor: string;
  storageUnit?: string;
};

// Helper function to convert hex color to RGBA with desired opacity
const hexToRGBA = (hex: string, opacity: number): string => {
  let r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const OverviewStorage: React.FC<OverViewStorageProps> = ({ files }) => {
  const storageUsage = calculateStorageUsage(files);

  const storageItems: StorageItem[] = [
    {
      id: 1,
      icon: jpgIcon,
      fileType: "Images",
      itemCount: storageUsage.images.count,
      usedGB: storageUsage.images.size,
      totalGB: 100,
      progressBarColor: "#FF6B50",
      storageUnit: storageUsage.images.unit,
    },
    {
      id: 2,
      icon: videoIcon,
      fileType: "Videos",
      itemCount: storageUsage.videos.count,
      usedGB: storageUsage.videos.size,
      totalGB: 100,
      progressBarColor: "#1FC5E4",
      storageUnit: storageUsage.videos.unit,
    },
    {
      id: 3,
      icon: docIcon,
      fileType: "Documents",
      itemCount: storageUsage.documents.count,
      usedGB: storageUsage.documents.size,
      totalGB: 100,
      progressBarColor: "#57BF98",
      storageUnit: storageUsage.documents.unit,
    },
    {
      id: 4,
      icon: otherIcon,
      fileType: "Others",
      itemCount: storageUsage.others.count,
      usedGB: storageUsage.others.size,
      totalGB: 100,
      progressBarColor: "#FFC21A",
      storageUnit: storageUsage.others.unit,
    },
  ];

  return (
    <div className="md:px-8 px-3 py-3">
      <h2 className="text-2xl font-bold mb-6">Overview Storage</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 md:gap-x-8 gap-x-3 gap-y-4">
        {storageItems.map((item: StorageItem) => {
          const progressPercentage = `${
            item.storageUnit === "MB"
              ? (item.usedGB / (item.totalGB * 1024)) * 100
              : (item.usedGB / item.totalGB) * 100
          }%`;

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
                  {item.usedGB} {item.storageUnit === "MB" ? "MB" : "GB"} of 100
                  GB
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
