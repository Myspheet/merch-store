import { Injectable } from '@nestjs/common';
import { UpdateProductDto } from 'src/catalog/product/dto/update-product.dto';
import { UserRepository } from './user.repository';

export type Tenant = any;

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) { }

  create(createUserDto) {
    return this.userRepository.create(createUserDto);
  }

  async findAll() {
    return await this.userRepository.findAll();
  }

  async findOne(id: number) {
    return this.userRepository.findById(id);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return this.userRepository.update(id, updateProductDto);
  }

  async remove(id: number) {
    return this.userRepository.delete(id);
  }
}
