import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { AdminJwtAuthGuard } from 'src/auth/strategy/jwt/admin-auth.guard';
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto';

@Controller('attributes')
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) { }

  @UseGuards(AdminJwtAuthGuard)
  @Post()
  create(@Body() createAttributeDto: CreateAttributeDto) {
    return this.attributeService.create(createAttributeDto);
  }


  @Get()
  findAll() {
    return this.attributeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attributeService.findOne(+id);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttributeDto: UpdateAttributeDto) {
    return this.attributeService.update(+id, updateAttributeDto);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attributeService.remove(+id);
  }


  // Attribute value endpoints
  @UseGuards(AdminJwtAuthGuard)
  @Post()
  addAttributeValue(@Param(':id/attribute') id: string, createAttributeValueDto: CreateAttributeValueDto) {
    return this.attributeService.addAttributeValue(+id, createAttributeValueDto)
  }
}
