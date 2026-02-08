import { Injectable, ConflictException } from '@nestjs/common';
import { InstitutionRepository } from '../../infrastructure/repositories/institution.repository'
import { CreateInstitutionDto } from '../../common/dtos/institution/create.institution.dto';
import { S3Service } from '../../common/helper/s3.helper';

@Injectable()
export class InstitutionService{
    constructor(
        private readonly institutionRepository : InstitutionRepository,
        private readonly s3Service: S3Service,
    ){}

    async create(
      data: CreateInstitutionDto,
      logoFile?: Express.Multer.File,  // <-- archivo opcional
    ){
        const existing = await this.institutionRepository.findFirst({
          where: { Nombre: data.nombre },
        });

        if (existing) {
          throw new ConflictException('Ya existe una institución con ese nombre');
        }

        // Vamos a tratar Logo_URL como "path/key" en S3
        let logoPath: string | null = null;

        // Si viene archivo, lo subimos a S3
        if (logoFile) {
          const extension = logoFile.originalname.split('.').pop();
          const safeName = (data.nombre ?? 'institucion')
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-_]/g, '');

          const key = `instituciones/${safeName}-${Date.now()}.${extension}`;

          const { key: storedKey } = await this.s3Service.uploadFile({
            buffer: logoFile.buffer,
            key,
            contentType: logoFile.mimetype,
          });

          logoPath = storedKey; // ej: instituciones/ministerio-x-123123.png
        } else if (data.logo_URL) {
          // opcional: si te mandan una URL directa, la guardas tal cual
          logoPath = data.logo_URL;
        }

        const institucion = await this.institutionRepository.create({
          data: {
            Nombre: data.nombre,
            Descripcion: data.descripcion,
            Logo_URL: logoPath,
          },
        });

        return institucion;
    }

    async findOne(id: string) {
        const institucion = await this.institutionRepository.findUnique({
            where: { Institucion_ID: id },
        });

        if (!institucion) {
            return null; // o lanzar NotFoundException
        }

        let logoUrl: string | null = null;

        if (institucion.Logo_URL) {
            // Aquí asumimos que Logo_URL guarda el key (path en S3)
            logoUrl = await this.s3Service.getSignedGetUrl(institucion.Logo_URL);
        }

        return {
            ...institucion,
            logoUrl, // esta es la que el front puede usar <img src={logoUrl} />
        };
    }
}
