import { Module } from '@nestjs/common';
import { S3Service } from './s3.helper';

@Module({
  providers: [S3Service],
  exports: [S3Service], // 🔥 CLAVE
})
export class S3Module {}