import jpgIcon from "../assets/icons/overview-storage/photo.svg";
import videoIcon from "../assets/icons/overview-storage/video.svg";
import docIcon from "../assets/icons/overview-storage/doc.svg";
import otherIcon from "../assets/icons/overview-storage/other.svg";

// Define the interface for each storage item
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

// Define the array with type annotation
export const storageItems: StorageItem[] = [
  {
    id: 1,
    icon: jpgIcon,
    fileType: "Images",
    itemCount: "5 items",
    usedSpace: "50 GB of 100 GB",
    usedGB: 50,
    totalGB: 100,
    progressBarColor: "#FF6B50",
  },
  {
    id: 2,
    icon: videoIcon,
    fileType: "Videos",
    itemCount: "10 items",
    usedSpace: "75 GB of 100 GB",
    usedGB: 75,
    totalGB: 100,
    progressBarColor: "#1FC5E4",
  },
  {
    id: 3,
    icon: docIcon,
    fileType: "Documents",
    itemCount: "100 items",
    usedSpace: "20 GB of 100 GB",
    usedGB: 20,
    totalGB: 100,
    progressBarColor: "#57BF98",
  },
  {
    id: 4,
    icon: otherIcon,
    fileType: "Others",
    itemCount: "50 items",
    usedSpace: "85 GB of 100 GB",
    usedGB: 85,
    totalGB: 100,
    progressBarColor: "#FFC21A",
  },
];
