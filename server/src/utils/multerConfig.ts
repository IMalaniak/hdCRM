import path from 'path';
import fs from 'fs';

import { Request } from 'express';
import multer from 'multer';

const uploadsFolder = path.join(__dirname, '../uploads');

const store = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    let dest: string;
    if (req.url.includes('avatar')) {
      dest = `${uploadsFolder}/images/userpic`;
    } else {
      dest = file.mimetype.includes('image/') ? `${uploadsFolder}/images` : `${uploadsFolder}/docs`;
    }
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    cb(null, dest);
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  }
});

const uploads = multer({ storage: store });

export { uploads };
