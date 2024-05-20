import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { AdminJwtAuthGuard } from 'src/auth/strategy/jwt/admin-auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'node:path';

@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @UseGuards(AdminJwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 10, {
    storage: diskStorage({
      destination: "./uploads/product/images",
      filename(req, file, callback) {
        const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
        const extension: string = path.parse(file.originalname).ext;

        callback(null, `${filename}${extension}`);
      },
    })
  }))

  create(@Body() createProductDto: CreateProductDto, @UploadedFiles() files) {
    const gallery = files.map((file, index) => {
      let newFile = { default: false };
      if (index === 0) {
        newFile.default = true
      }

      return { ...newFile, imageUrl: file.path };
    })

    return this.productService.create(createProductDto, gallery);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AdminJwtAuthGuard)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AdminJwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
