// src/common/helper/s3.helper.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private readonly s3: S3Client;
  private readonly bucket = process.env.AWS_S3_BUCKET!;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async uploadFile(params: {
    buffer: Buffer;
    key: string;
    contentType: string;
  }): Promise<{ key: string }> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: params.key,
        Body: params.buffer,
        ContentType: params.contentType,
      });

      await this.s3.send(command);

      return { key: params.key };
    } catch (err) {
      console.error('Error subiendo a S3:', err);
      throw new InternalServerErrorException('No se pudo subir el archivo al almacenamiento');
    }
  }

  async getSignedGetUrl(key: string, expiresInSeconds = 60 * 5): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const url = await getSignedUrl(this.s3, command, {
        expiresIn: expiresInSeconds,
      });

      return url;
    } catch (err) {
      console.error('Error generando URL firmada:', err);
      throw new InternalServerErrorException('No se pudo generar la URL de descarga');
    }
  }
}
