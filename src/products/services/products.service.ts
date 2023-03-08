import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { Product } from './../entities/product.entity';
import {
  CreateProductDto,
  UpdateProductDto,
  FilterProductsDto,
} from './../dtos/products.dtos';

@Injectable()
export class ProductsService {
  //intectamos el modelo...
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  findAll(params?: FilterProductsDto) {
    // if (params) {
    //*Dejamos un filto generico para cualquier propiedad de los productos...
    const filters: FilterQuery<Product> = {};
    const { limit = 5, offset = 0, minPrice, maxPrice } = params;
    if (minPrice && maxPrice) {
      //*$gte(mayor o igual) $lte(menor o igual), mongo nos permite enviar un json con caracteristicas para el filtrado
      filters.price = { $gte: minPrice, $lte: maxPrice };
    }
    return (
      this.productModel
        //*Si esta vacio filters, mongo sabe que no va a filtrar por ninguna propiedad
        .find(filters)
        //*El populate va a resolver la referencia hacia brand para traerse el objeto por su id
        .populate('brand')
        .skip(offset * limit)
        .limit(limit)
        .exec()
    );
    // }
    // return this.productModel.find().populate('brand').exec();
  }

  // async findAll(params?: FilterProductsDto) {
  //   const { limit = 5, offset = 0 } = params;
  //   const [total, products] = await Promise.all([
  //     this.productModel.countDocuments(),
  //     this.productModel
  //       .find()
  //       .skip(offset * limit)
  //       .limit(limit)
  //       .exec(),
  //   ]);
  //   return { products, total };
  //   // return this.productModel
  //   //   .find()
  //   //   .skip(offset * limit)
  //   //   .limit(limit)
  //   //   .exec();
  // }

  async findOne(id: string) {
    const product = await this.productModel
      .findById(id)
      .populate('brand')
      .exec();
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  create(data: CreateProductDto) {
    const newProduct = new this.productModel(data);
    return newProduct.save();
  }

  update(id: string, changes: UpdateProductDto) {
    const product = this.productModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();
    //*la instruccion $set hace que solo se midifiquen los atributos enviados en los cambios y los une al modelo ya consuktado
    //*la instrucccion new va a retornar el elemento actualizado
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }
}
