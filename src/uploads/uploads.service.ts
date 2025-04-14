import { Injectable } from '@nestjs/common';
import { Uploads } from './entities/uploads.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

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
        const result = await this.uploadsRepository.delete(fileId);
        return {
            message: result.affected ? 'Deleted successfully' : 'File with id:'+fileId+' not found'
        }   
    }
}
