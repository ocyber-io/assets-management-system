import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../../frontend/public/uploads/temp"));
  },
  filename: function (req, file, cb) {
    // Using Date.now() to append a timestamp for uniqueness
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "file-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("file");

function checkFileType(file: any, cb: any) {
  console.log("Received file:", file);

  const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
  const allowedVideoTypes = ["video/mp4", "video/mov", "video/avi"];
  const allowedDocumentTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/x-rar-compressed", // .rar files
    "application/zip", // .zip files
  ];

  // Add a separate check for .rar files
  const isRar =
    file.originalname.endsWith(".rar") ||
    file.mimetype === "application/x-rar-compressed";

  if (
    allowedImageTypes.includes(file.mimetype) ||
    allowedVideoTypes.includes(file.mimetype) ||
    allowedDocumentTypes.includes(file.mimetype) ||
    isRar // Check if it's a .rar file
  ) {
    return cb(null, true);
  } else {
    cb("Error: Images, Videos, Documents, .rar, and .zip files Only!");
  }
}

export default upload;
