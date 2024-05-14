import { Injectable } from '@nestjs/common';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { AttributeRepository } from './repository/attribute.repository';
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto';

@Injectable()
export class AttributeService {
  constructor(
    private readonly attributeRepository: AttributeRepository
  ) { }
  create(createAttributeDto: CreateAttributeDto) {
    return this.attributeRepository.create(createAttributeDto);
  }

  addAttributeValue(id: number, createAttributeValueDto: CreateAttributeValueDto) {
    return this.attributeRepository.addAttributeValue(id, createAttributeValueDto);
  }

  findAll() {
    return this.attributeRepository.findAll();
  }

  findOne(id: number) {
    return this.attributeRepository.findById(id);
  }

  update(id: number, updateAttributeDto: UpdateAttributeDto) {
    return this.attributeRepository.update(id, updateAttributeDto);
  }

  remove(id: number) {
    return this.attributeRepository.delete(id);
  }
}
