import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRequisitoTipoDocumentoDto } from 'src/common/dtos/requisito-tipo-documento/create-requisito-tipo-documento.dto';
import { UpdateRequisitoTipoDocumentoDto } from 'src/common/dtos/requisito-tipo-documento/update-requisito-tipo-documento.dto';
import { TipoDocumentoRepository } from 'src/infrastructure/repositories/tipo-documento.repository';
import { RequisitoTipoDocumentoRepository } from 'src/infrastructure/repositories/requisito-tipo-documento.repository';

@Injectable()
export class RequisitoTipoDocumentoService {
  constructor(
    private readonly requisitoRepository: RequisitoTipoDocumentoRepository,
    private readonly tipoDocumentoRepository: TipoDocumentoRepository,
  ) {}

  async create(tipoDocumentoId: number, data: CreateRequisitoTipoDocumentoDto) {

    const tipoDocumento = await this.tipoDocumentoRepository.findUnique({
      where: { TipoDocumento_ID: tipoDocumentoId },
    });

    if (!tipoDocumento) {
      throw new NotFoundException('Tipo de documento no encontrado');
    }

    return this.requisitoRepository.create({
      data: {
        Nombre: data.nombre,
        Descripcion: data.descripcion,
        EsObligatorio: data.esObligatorio ?? true,
        Requiere_Archivo: data.requiereArchivo ?? true,

        tipoDocumento: {
          connect: {
            TipoDocumento_ID: tipoDocumentoId,
          },
        },

        ...(data.tipoDocumentoRequeridoId && {
          tipoDocumentoRequerido: {
            connect: {
              TipoDocumento_ID: data.tipoDocumentoRequeridoId,
            },
          },
        }),
      },
    });
  }

  async findByTipoDocumento(tipoDocumentoId: number) {
    return this.requisitoRepository.findMany({
      where: {
        TipoDocumento_ID: tipoDocumentoId,
      },
      include: {
        tipoDocumentoRequerido: true,
      },
    });
  }

  async update(id: number, data: UpdateRequisitoTipoDocumentoDto) {

    const requisito = await this.requisitoRepository.findUnique({
      where: { Requisito_ID: id },
    });

    if (!requisito) {
      throw new NotFoundException('Requisito no encontrado');
    }

    return this.requisitoRepository.update({
      where: { Requisito_ID: id },
      data: {
        ...(data.nombre && { Nombre: data.nombre }),
        ...(data.descripcion && { Descripcion: data.descripcion }),
        ...(data.esObligatorio !== undefined && { EsObligatorio: data.esObligatorio }),
        ...(data.requiereArchivo !== undefined && { Requiere_Archivo: data.requiereArchivo }),
      },
    });
  }

  async remove(id: number) {

    const requisito = await this.requisitoRepository.findUnique({
      where: { Requisito_ID: id },
    });

    if (!requisito) {
      throw new NotFoundException('Requisito no encontrado');
    }

    return this.requisitoRepository.delete({
      where: { Requisito_ID: id },
    });
  }
}