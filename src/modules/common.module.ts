import { Module } from '@nestjs/common';
import { S3Service } from '../common/helper/s3.helper';

@Module({
  providers: [S3Service],
  exports: [S3Service],
})
export class CommonModule {}