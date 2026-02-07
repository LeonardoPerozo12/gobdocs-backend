import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsUUID, 
} from 'class-validator';

export class UserRegisterDto{
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    nombre: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    apellido: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{3}-\d{7}-\d{1}$/, {
        message: 'La cédula debe tener el formato XXX-XXXXXXX-X',
    })
    cedula: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(64)
    password: string;
    
    // @IsUUID()
    // @IsNotEmpty()
    institucionId?: string;
}