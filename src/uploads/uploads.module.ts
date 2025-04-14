import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { Uploads } from './entities/uploads.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Uploads])],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
