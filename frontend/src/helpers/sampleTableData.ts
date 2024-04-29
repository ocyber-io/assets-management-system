// Define the interface for the structure of each file object
interface File {
  id: number;
  name: string;
  lastModified: string;
  link: string;
  size: string;
}

// Define the array with the type annotation using the File interface
export const files: File[] = [
  {
    id: 1,
    name: "Report.pdf",
    lastModified: "2023-04-20",
    link: "https://example.com/file1",
    size: "1.5 MB",
  },
  {
    id: 2,
    name: "Budget.xlsx",
    lastModified: "2023-04-19",
    link: "https://example.com/file2",
    size: "200 KB",
  },
  {
    id: 3,
    name: "Presentation.pptx",
    lastModified: "2023-04-18",
    link: "https://example.com/file3",
    size: "3.2 MB",
  },
  {
    id: 4,
    name: "Document.docx",
    lastModified: "2023-04-17",
    link: "https://example.com/file4",
    size: "4.5 MB",
  },
  {
    id: 5,
    name: "Image.png",
    lastModified: "2023-04-16",
    link: "https://example.com/file5",
    size: "2.5 MB",
  },
  {
    id: 6,
    name: "Notes.txt",
    lastModified: "2023-04-15",
    link: "https://example.com/file6",
    size: "750 KB",
  },
  {
    id: 7,
    name: "Report.pdf",
    lastModified: "2023-04-20",
    link: "https://example.com/file1",
    size: "1.5 MB",
  },
  {
    id: 8,
    name: "Budget.xlsx",
    lastModified: "2023-04-19",
    link: "https://example.com/file2",
    size: "200 KB",
  },
  {
    id: 9,
    name: "Presentation.pptx",
    lastModified: "2023-04-18",
    link: "https://example.com/file3",
    size: "3.2 MB",
  },
  {
    id: 10,
    name: "Document.docx",
    lastModified: "2023-04-17",
    link: "https://example.com/file4",
    size: "4.5 MB",
  },
  {
    id: 11,
    name: "Image.png",
    lastModified: "2023-04-16",
    link: "https://example.com/file5",
    size: "2.5 MB",
  },
  {
    id: 12,
    name: "Notes.txt",
    lastModified: "2023-04-15",
    link: "https://example.com/file6",
    size: "750 KB",
  },
];
