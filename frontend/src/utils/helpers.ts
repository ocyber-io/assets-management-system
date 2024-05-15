export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleString("en-US", {
    year: "numeric", // "2024"
    month: "2-digit", // "05"
    day: "2-digit", // "09"
    hour: "2-digit", // "11"
    minute: "2-digit", // "16"
    hour12: true, // AM/PM format
  });
  return formattedDate;
};

export function formatFilename(filename: string, isMobile: boolean = false) {
  const startChars = isMobile ? 8 : 15;
  const endChars = 5;

  if (filename.length > startChars + endChars) {
    return `${filename.slice(0, startChars)}...${filename.slice(-endChars)}`;
  }
  return filename;
}

export function formatFilenameInSuccessModal(
  filename: string,
  isMobile: boolean = false
) {
  const startChars = isMobile ? 8 : 12;
  const endChars = 5;

  if (filename.length > startChars + endChars) {
    return `${filename.slice(0, startChars)}...${filename.slice(-endChars)}`;
  }
  return filename;
}

export const calculateStorageUsage = (files: any) => {
  const storageTypes = {
    images: { size: 0, count: 0, unit: "MB" },
    videos: { size: 0, count: 0, unit: "MB" },
    documents: { size: 0, count: 0, unit: "MB" },
    others: { size: 0, count: 0, unit: "MB" },
  };

  // Define file extensions for different types
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];
  const videoExtensions = [".mp4", ".avi", ".mov", ".mkv"];
  const documentExtensions = [".pdf", ".doc", ".docx", ".txt"];

  // Helper function to convert size string to bytes
  const convertSizeToBytes = (sizeStr: string) => {
    const [value, unit] = sizeStr.split(" ");
    const sizeValue = parseFloat(value);

    switch (unit.toUpperCase()) {
      case "BYTES":
        return sizeValue;
      case "KB":
        return sizeValue * 1024;
      case "MB":
        return sizeValue * 1024 * 1024;
      default:
        return 0;
    }
  };

  files.forEach((file: any) => {
    const extension = file.name
      .substr(file.name.lastIndexOf("."))
      .toLowerCase();
    const fileSizeInBytes = convertSizeToBytes(file.size);

    if (imageExtensions.includes(extension)) {
      storageTypes.images.size += fileSizeInBytes;
      storageTypes.images.count++;
    } else if (videoExtensions.includes(extension)) {
      storageTypes.videos.size += fileSizeInBytes;
      storageTypes.videos.count++;
    } else if (documentExtensions.includes(extension)) {
      storageTypes.documents.size += fileSizeInBytes;
      storageTypes.documents.count++;
    } else {
      storageTypes.others.size += fileSizeInBytes;
      storageTypes.others.count++;
    }
  });

  // Helper function to convert bytes to appropriate unit
  const convertBytesToAppropriateUnit = (sizeInBytes: number) => {
    if (sizeInBytes >= 1000 * 1024 * 1024) {
      return {
        size: parseFloat((sizeInBytes / (1024 * 1024 * 1024)).toFixed(2)),
        unit: "GB",
      };
    }
    return {
      size: parseFloat((sizeInBytes / (1024 * 1024)).toFixed(2)),
      unit: "MB",
    };
  };

  // Convert total sizes to appropriate units
  const convertedImages = convertBytesToAppropriateUnit(
    storageTypes.images.size
  );
  storageTypes.images.size = convertedImages.size;
  storageTypes.images.unit = convertedImages.unit;

  const convertedVideos = convertBytesToAppropriateUnit(
    storageTypes.videos.size
  );
  storageTypes.videos.size = convertedVideos.size;
  storageTypes.videos.unit = convertedVideos.unit;

  const convertedDocuments = convertBytesToAppropriateUnit(
    storageTypes.documents.size
  );
  storageTypes.documents.size = convertedDocuments.size;
  storageTypes.documents.unit = convertedDocuments.unit;

  const convertedOthers = convertBytesToAppropriateUnit(
    storageTypes.others.size
  );
  storageTypes.others.size = convertedOthers.size;
  storageTypes.others.unit = convertedOthers.unit;

  return storageTypes;
};
