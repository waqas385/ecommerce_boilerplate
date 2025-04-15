import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { fileExtensionFilter } from './util/file-filter.util';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/users/enum/role.enum';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Roles(Role.Admin, Role.User)
  @Post('file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // folder where files will be saved
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: fileExtensionFilter,
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('description') description: string) {
    console.log(file);
    await this.uploadsService.saveFileInfo(file, description);

    return {
      message: 'File uploaded successfully!',
      filename: file.filename,
      filepath: `./uploads/${file.filename}`
    };
  }

  @Roles(Role.Admin, Role.User)
  @Get('file')
  async findFiles(@Query() params: {fileName: string; description: string}) {
    console.log(`${params.fileName} - ${params.description}`);
    return await this.uploadsService.findFiles(params.fileName, params.description);
  }

  @Roles(Role.Admin, Role.User)
  @Delete('file/:fileId')
  async deleteFile(@Param('fileId') fileId: number) {
    return await this.uploadsService.deleteFile(fileId);
  }
}
