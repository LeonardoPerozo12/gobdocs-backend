import {Injectable} from '@nestjs/common';
import { Institucion } from '@prisma/client';
import {PrismaService} from '../db/prisma.service';
import { BaseRepository } from './base.repository';

@Injectable()
export class InstitutionRepository extends BaseRepository<
    Institucion,
    PrismaService['institucion']
>{}
