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

export const calculateStorageUsage = (files: any) => {
  const storageTypes = {
    images: { size: 0, count: 0 },
    videos: { size: 0, count: 0 },
    documents: { size: 0, count: 0 },
    others: { size: 0, count: 0 },
  };

  // Define file extensions for different types
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];
  const videoExtensions = [".mp4", ".avi", ".mov", ".mkv"];
  const documentExtensions = [".pdf", ".doc", ".docx", ".txt"];

  files.forEach((file: any) => {
    const extension = file.name
      .substr(file.name.lastIndexOf("."))
      .toLowerCase();
    const fileSizeInBytes = parseFloat(file.size) * 1024; // Convert from KB to bytes

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

  const allocatedSpace = {
    images: 100 * 1024 * 1024, // 100 GB converted to KB
    videos: 100 * 1024 * 1024,
    documents: 100 * 1024 * 1024,
    others: 100 * 1024 * 1024,
  };

  const usedStorage = {
    images: allocatedSpace.images - storageTypes.images.size,
    videos: allocatedSpace.videos - storageTypes.videos.size,
    documents: allocatedSpace.documents - storageTypes.documents.size,
    others: allocatedSpace.others - storageTypes.others.size,
  };

  // Convert total sizes back to KB
  storageTypes.images.size = parseFloat(
    (storageTypes.images.size / 1024).toFixed(2)
  );
  storageTypes.videos.size = parseFloat(
    (storageTypes.videos.size / 1024).toFixed(2)
  );
  storageTypes.documents.size = parseFloat(
    (storageTypes.documents.size / 1024).toFixed(2)
  );
  storageTypes.others.size = parseFloat(
    (storageTypes.others.size / 1024).toFixed(2)
  );

  return { storageTypes, usedStorage };
};
