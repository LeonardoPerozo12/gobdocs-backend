import { Controller, Post, Body } from '@nestjs/common';
import { InstitutionService } from '../../application/institution/institution.service';
import { CreateInstitutionDto } from '../../common/dtos/institution/create.institution.dto';


@Controller('institution')
export class institutionController{
    constructor(private readonly institutionService :InstitutionService){}

    @Post('create')
    async create(@Body() dto:CreateInstitutionDto){
        return this.institutionService.create(dto);
    }
}