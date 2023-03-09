import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Order } from '../entities/order.entity';
import { CreateOrderDto, UpdateOrderDto } from '../dtos/order.dto';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  findAll() {
    return this.orderModel
      .find()
      .populate('customer')
      .populate('products')
      .exec();
    //*Ejemplo de pupulate anidado en caso de ser necesario...
    /*
       .find()
      .populate('products)
      .populate({
        path: 'customer',
        populate: {
          path: 'skills',
        },
      })
      .exec();
       */
  }

  async findOne(id: string) {
    return this.orderModel.findById(id);
  }

  create(data: CreateOrderDto) {
    const newModel = new this.orderModel(data);
    return newModel.save();
  }

  update(id: string, changes: UpdateOrderDto) {
    return this.orderModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();
  }

  remove(id: string) {
    return this.orderModel.findByIdAndDelete(id);
  }

  async removeProduct(id: string, productId: string) {
    const order = await this.orderModel.findById(id);
    order.products.pull(productId);
    return order.save();
  }

  async addProducs(id: string, productsIds: string[]) {
    const order = await this.orderModel.findById(id);
    productsIds.forEach((pId) => order.products.push(pId));
    return order.save();
  }

  /*
  Para evitar duplicados en orders.productsIds podemos usar el operador de mongo $addToSet. Este operador agrega los elementos al array a menos que el valor ya se encuentre en el mismo.

// Products
  async addProducts(idOrder: string, productsIds: string[]){
    const order = await this.OrderModel.findByIdAndUpdate(
      idOrder,
      { $addToSet: { productos: productsIds }}
    )

    if(!order){
      throw new NotFoundException(`order ${idOrder} not found`);
    }

    return await order.save();
  }
   */
}
