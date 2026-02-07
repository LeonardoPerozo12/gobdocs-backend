import {
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class UserLoginDto{

    @IsNotEmpty({ message: 'El correo es obligatorio' })
    @IsEmail({}, { message: 'Debe ser un correo válido' })
    email: string;

    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    @IsString({ message: 'La contraseña debe ser un texto' })
    password: string;

}