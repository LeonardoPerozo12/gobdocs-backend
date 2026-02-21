import {Injectable} from '@nestjs/common';
import { RolUsuario, Usuario } from '@prisma/client';
import {PrismaService} from '../db/prisma.service';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserRepository extends BaseRepository<
    Usuario,
    PrismaService['usuario']
>{
    constructor(prisma: PrismaService){
        super(prisma.usuario);
    }

    async findByEmail(correo: string){
        return this.delegate.findFirst({
            where: {Correo : correo},
        });
    }
    async findByCedula(cedula: string) {
        return this.delegate.findFirst({
        where: { Cedula : cedula },
        });
    }
    async findByCedulaAndRol(cedula: string, rol: RolUsuario) {
    return this.delegate.findFirst({
        where: {
            Cedula: cedula,
            Rol: rol,
        },
        });
    }
    async findActiveUsers() {
        return this.findMany({
        where: { Activo: true },
        });
    }
}