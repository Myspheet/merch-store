import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { AttributeModule } from './attribute/attribute.module';

@Module({
  imports: [ProductModule, AttributeModule]
})
export class CatalogModule { }
