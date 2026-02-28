import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTipoDocumentoDto } from 'src/common/dtos/tipo-documento/create-tipo-documento.dto';
import { UpdateTipoDocumentoDto } from 'src/common/dtos/tipo-documento/update.tipo-documento.dto';
import { InstitutionRepository } from 'src/infrastructure/repositories/institution.repository';
import { TipoDocumentoRepository } from 'src/infrastructure/repositories/tipo-documento.repository';

@Injectable()
export class TipoDocumentoService {
    constructor(
        private readonly tipoDocumentoRepository: TipoDocumentoRepository,
        private readonly institutionRepository: InstitutionRepository,
    ) {}

    async createForInstitution(institutionId: string, data: CreateTipoDocumentoDto) {
        

        const institution = await this.institutionRepository.findUnique({
            where: {
                Institucion_ID: institutionId,
            },
        });

        if (!institution) {
            throw new NotFoundException('No se encontró la institución');
        }

        return this.tipoDocumentoRepository.create({
            data: {
                Nombre: data.nombre,
                Descripcion: data.descripcion,
                institucion: {
                        connect: {
                            Institucion_ID: institutionId,
                    },
                },
            },
        });
        
    }

    async findAll() {   
        return this.tipoDocumentoRepository.findMany({
            include: {
                institucion: true,
                formularios: true,
                requisitos: true,
            },
        });
    }

    async findByInstitution(institutionId: string) {
        const institution = await this.institutionRepository.findUnique({
            where: {
                Institucion_ID: institutionId,
            },
        });
        if(!institution){
            throw new NotFoundException('No se encontró la institución');
        }

        return this.tipoDocumentoRepository.findMany({
            where: {
                Institucion_ID: institutionId,
            },
            include: {
                formularios: true,
                requisitos: true,
            },
        });
    }
    async findOne(id: number) {

        const tipoDocumento = await this.tipoDocumentoRepository.findUnique({
            where: {
                TipoDocumento_ID: id,
            },
            include: {
                institucion: true,
                formularios: true,
                requisitos: true,
            },
        });

        if(!tipoDocumento){
            throw new NotFoundException('No se encontró el tipo de documento');
        }

        return tipoDocumento;
    }

    async update(id: number, data: UpdateTipoDocumentoDto) {

        await this.findOne(id); // para lanzar NotFoundException si no existe

        return this.tipoDocumentoRepository.update({
            where: {
                TipoDocumento_ID: id,
            },
            data: {
                ...(data.nombre && { Nombre: data.nombre }),
                ...(data.descripcion && { Descripcion: data.descripcion }),
            },
        });
    }
}