import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Fetch products and validate stock
    const products = await Promise.all(
      createOrderDto.productIds.map(async (productId) => {
        const product = await this.productRepository.findOne({ where: { id: productId } });
        if (!product) {
          throw new NotFoundException(`Product with ID ${productId} not found`);
        }
        if (product.stockQuantity < 1) {
          throw new BadRequestException(`Product ${product.name} is out of stock`);
        }
        return product;
      })
    );

    // Calculate total price
    const totalPrice = products.reduce((sum, product) => sum + product.price, 0);

    // Create order
    const order = this.orderRepository.create({
      user,
      products,
      totalPrice,
      status: OrderStatus.PENDING,
      shippingAddress: createOrderDto.shippingAddress,
    });

    // Reduce product stock
    await Promise.all(
      products.map(async (product) => {
        product.stockQuantity -= 1;
        await this.productRepository.save(product);
      })
    );

    return this.orderRepository.save(order);
  }

  async findAll(userId: string, page = 1, limit = 10): Promise<{ orders: Order[], total: number }> {
    const skip = (page - 1) * limit;

    const [orders, total] = await this.orderRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ['products'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { orders, total };
  }

  async findOne(id: string, userId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['products'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async update(id: string, userId: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id, userId);

    // Only allow updating certain statuses
    if (updateOrderDto.status) {
      order.status = updateOrderDto.status;
    }

    if (updateOrderDto.shippingAddress) {
      order.shippingAddress = updateOrderDto.shippingAddress;
    }

    return this.orderRepository.save(order);
  }

  async cancel(id: string, userId: string): Promise<Order> {
    const order = await this.findOne(id, userId);

    // Only cancel pending orders
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    // Restore product stock
    await Promise.all(
      order.products.map(async (product) => {
        product.stockQuantity += 1;
        await this.productRepository.save(product);
      })
    );

    order.status = OrderStatus.CANCELLED;
    return this.orderRepository.save(order);
  }
}
