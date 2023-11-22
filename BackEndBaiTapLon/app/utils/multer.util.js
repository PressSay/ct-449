import multer from "multer";
import path from "node:path";

class Multer {
  constructor() {
    const storage = multer.diskStorage({
      destination: "./public/uploads/",
      filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
      }
    });
    const upload = multer({
      storage: storage
    });
    this.Upload = upload;
  }

  single = (fieldname) => {
    return this.Upload.single(fieldname);
  }

  array = (fieldname, maxCount) => {
    return this.Upload.array(fieldname, maxCount);
  } 
}

export default Multer;