import multer from "multer";
import path from "path";
import fs from "fs";

function makeFolder(folder) {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join("./uploads/", folder);
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
}

export const uploadCategories = multer({ storage: makeFolder("categories") });
export const uploadArtist = multer({ storage: makeFolder("artists") });
