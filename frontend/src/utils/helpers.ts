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
  console.log("Formatted Date:", formattedDate); // Check what is being returned
  return formattedDate;
};

export function formatFilename(filename: string, isMobile: boolean = false) {
  // Determine how many characters to show based on the device
  const startChars = isMobile ? 8 : 15;
  const endChars = 5;

  if (filename.length > startChars + endChars) {
    return `${filename.slice(0, startChars)}...${filename.slice(-endChars)}`;
  }
  return filename;
}
