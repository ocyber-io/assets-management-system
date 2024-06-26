import { File } from "../Types";

const sampleTags = [
  "Finance",
  "Marketing",
  "HR",
  "Project",
  "Confidential",
  "Public",
  "Finankol",
  "Markisidei",
  "Kurksi",
  "NMcnsue",
  "Sakhat-Secret",
  "What",
  "Poeiure",
  "Jdurs",
  "MR",
  "Csduir",
  "When",
];

const getRandomTags = () => {
  const shuffled = sampleTags.sort(() => 0.5 - Math.random()); // Shuffle array
  return shuffled.slice(0, Math.floor(Math.random() * shuffled.length + 1)); // Get sub-array of tags
};

export const files: File[] = [
  {
    id: 1,
    name: "Report.pdf",
    lastModified: "2023-04-20",
    link: "https://example.com/file1",
    size: "1.5 MB",
    tags: getRandomTags(),
  },
  {
    id: 2,
    name: "Budget.xlsx",
    lastModified: "2023-04-19",
    link: "https://example.com/file2",
    size: "200 KB",
    tags: getRandomTags(),
  },
  {
    id: 3,
    name: "Presentation.pptx",
    lastModified: "2023-04-18",
    link: "https://example.com/file3",
    size: "3.2 MB",
    tags: getRandomTags(),
  },
  {
    id: 4,
    name: "Document.docx",
    lastModified: "2023-04-17",
    link: "https://example.com/file4",
    size: "4.5 MB",
    tags: getRandomTags(),
  },
  {
    id: 5,
    name: "Image.png",
    lastModified: "2023-04-16",
    link: "https://example.com/file5",
    size: "2.5 MB",
    tags: getRandomTags(),
  },
  {
    id: 6,
    name: "Notes.txt",
    lastModified: "2023-04-15",
    link: "https://example.com/file6",
    size: "750 KB",
    tags: getRandomTags(),
  },
  {
    id: 7,
    name: "Report.pdf",
    lastModified: "2023-04-20",
    link: "https://example.com/file1",
    size: "1.5 MB",
    tags: getRandomTags(),
  },
  {
    id: 8,
    name: "Budget.xlsx",
    lastModified: "2023-04-19",
    link: "https://example.com/file2",
    size: "200 KB",
    tags: getRandomTags(),
  },
  {
    id: 9,
    name: "Presentation.pptx",
    lastModified: "2023-04-18",
    link: "https://example.com/file3",
    size: "3.2 MB",
    tags: getRandomTags(),
  },
  {
    id: 10,
    name: "Document.docx",
    lastModified: "2023-04-17",
    link: "https://example.com/file4",
    size: "4.5 MB",
    tags: getRandomTags(),
  },
  {
    id: 11,
    name: "Image.png",
    lastModified: "2023-04-16",
    link: "https://example.com/file5",
    size: "2.5 MB",
    tags: getRandomTags(),
  },
  {
    id: 12,
    name: "Notes.txt",
    lastModified: "2023-04-15",
    link: "https://example.com/file6",
    size: "750 KB",
    tags: getRandomTags(),
  },
  {
    id: 12,
    name: "Notes.txt",
    lastModified: "2023-04-15",
    link: "https://example.com/file6",
    size: "750 KB",
    tags: getRandomTags(),
  },
];
