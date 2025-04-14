import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';

const allowedExtensions = ['.jpeg', '.jpg', '.png', '.docx', '.pdf'];

export const fileExtensionFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  const fileExt = extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(fileExt)) {
    callback(null, true);
  } else {
    callback(new BadRequestException(`Unsupported file type ${fileExt}`), false);
  }
};

// Export list so it can be edited in one place
export const ALLOWED_EXTENSIONS = allowedExtensions;
