import {RolUsuario} from '@prisma/client'

export interface JwtPayload {
  sub: string;         
  email: string;       
  rol: RolUsuario;    
  institucionId: string | null;
}