import fs from "node:fs";
import path from "node:path";
import multer from "multer";

function multerStorage(src: string, isProduct: boolean = false) {
  if (fs.existsSync(src)) {
    fs.mkdirSync(src, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // if (isProduct) {
      //   const user = req.user;
      //   const newSrc = path.join(src, user.username);
      //   if (fs.existsSync(newSrc)) {
      //     fs.mkdirSync(newSrc, { recursive: true });
      //   }
      //   cb(null, newSrc);
      // } else {
      //   cb(null, src);
      // }
      cb(null, src);
    },
    filename: function (req, file, cb) {
      const oldName = file.originalname.split(".");
      const extName = oldName.pop();
      const fileName = oldName.join(".");

      cb(null, `${fileName}-${Date.now()}.${extName}`);
    },
  });

  const uploader = multer({
    storage: storage,
    limits: { fileSize: 50000000 },
  });

  return uploader;
}

export default multerStorage;
