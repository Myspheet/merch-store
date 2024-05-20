import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './repository/product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) { }

  create(createProductDto, gallery = []) {
    const { variation = [], ...product } = createProductDto;

    if (variation.length > 0) {
      return this.productRepository.createProductWithVariation(product, variation, gallery);
    }

    return this.productRepository.create(product, gallery);
  }

  async findAll() {
    return await this.productRepository.findAll();
  }

  async findOne(id: number) {
    return this.productRepository.findById(id);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return this.productRepository.update(id, updateProductDto);
  }

  async remove(id: number) {
    return this.productRepository.delete(id);
  }
}
