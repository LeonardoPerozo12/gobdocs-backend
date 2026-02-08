import { Injectable, ConflictException } from '@nestjs/common';
import { InstitutionRepository } from '../../infrastructure/repositories/institution.repository'
import { CreateInstitutionDto } from '../../common/dtos/institution/create.institution.dto';

@Injectable()
export class InstitutionService{
    constructor(
        private readonly institutionRepository : InstitutionRepository,
    ){}

    async create(data: CreateInstitutionDto){

        const existing = await this.institutionRepository.findFirst({
        where: { Nombre: data.nombre },
        });

        if (existing) {
            throw new ConflictException('Ya existe una institución con ese nombre');
        }
        const institucion = await this.institutionRepository.create({

            data: {
                Nombre: data.nombre,
                Descripcion: data.descripcion,
                Logo_URL: data.logo_URL,
            },
        });

        return institucion;
    }
}
