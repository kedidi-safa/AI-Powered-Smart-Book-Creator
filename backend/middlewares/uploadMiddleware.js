const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const name = file.originalname.split(".")[0];
    const ext = path.extname(file.originalname);
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

//Check file type
function checkFileType(file, cb) {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only");
  }
}

//Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("coverImage");

module.exports = upload;
