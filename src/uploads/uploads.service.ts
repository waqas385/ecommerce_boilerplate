import { BadRequestException, Injectable } from '@nestjs/common';
import { Uploads } from './entities/uploads.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadsService {
    constructor(
        @InjectRepository(Uploads)
        private uploadsRepository: Repository<Uploads>,
    ) {}

    async saveFileInfo(file: Express.Multer.File, description: string) {
        const createFile = this.uploadsRepository.create({
            fileName: file.filename,
            description
        });

        await this.uploadsRepository.insert(createFile);
        return createFile;
    }

    async findFiles(fileName: string, description: string) {
        return await this.uploadsRepository.find({
            where: [
                {
                    fileName: Like(`%${fileName}%`),
                },
                {
                    description: Like(`%${description}%`)
                }
            ]
        });
    }

    async deleteFile(fileId: number) {
        const file = await this.uploadsRepository.findOneBy({id: fileId});
        if (!file) {
            throw new BadRequestException('Invalid file id');
        }
        // first delete file from folder
        this.deleteFileFromDirectory(file.fileName);
        // second delete file info from DB table
        const result = await this.uploadsRepository.delete(fileId);
        return {
            message: result.affected ? 'Deleted successfully' : 'File with id:'+fileId+' not found'
        }   
    }

    private deleteFileFromDirectory(fileName: string): string {
        const filePath = path.join(__dirname, '..', '..', 'uploads', fileName); // Adjust path as needed

        if (!fs.existsSync(filePath)) {
            return `File "${fileName}" not found.`;
        }

        try {
            fs.unlinkSync(filePath);
            return `File "${fileName}" deleted successfully.`;
        } catch (err) {
            throw new Error(`Error deleting file: ${err.message}`);
        }
    }
}
