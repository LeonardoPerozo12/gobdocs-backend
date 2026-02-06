import {Injectable, NotFoundException , ConflictException ,} from '@nestjs/common';
import { UserRepository} from '../../infrastructure/repositories/user.repository';
import { UserRegisterDto } from '../../common/dtos/user/user.register.dto';
import { UserLoginDto } from '../../common/dtos/user/user.login.dto';
import { RolUsuario } from '@prisma/client';
import {AuthService} from '../../common/auth/auth.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService{
    constructor(
        private readonly userRepository : UserRepository, // repository's DI
        private readonly authService : AuthService,
    ){}

    async registerCitzen(data: UserRegisterDto){

        const existingEmail = await this.userRepository.findByEmail(data.email);
        if(existingEmail){
            throw new ConflictException('Ya hay un usuario con este correo');
        }

        const existingCedula = await this.userRepository.findByCedula(data.cedula);
        if(existingCedula){
            throw new ConflictException('Ya existe un usuario con esta cedula');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const fullName = `${data.nombre.trim()} ${data.apellido.trim()}`;

        const usuario = await this.userRepository.create({
            data: {
                Nombre: fullName,
                Cedula: data.cedula,
                Correo: data.email,
                Contrasena: hashedPassword,
                Rol: RolUsuario.CIUDADANO,
                Activo: true,
                // Institucion_ID: data.institucionId,
            },
        });
    }
    async login(data: UserLoginDto){
        const user = this.authService.login(data)
    }

}