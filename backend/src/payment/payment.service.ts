import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Order, OrderStatus } from '../entities/order.entity';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(order: Order) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(order.totalPrice * 100), // Convert to cents
        currency: 'usd',
        metadata: { 
          orderId: order.id 
        },
      });

      // Save payment intent ID to order
      order.paymentIntentId = paymentIntent.id;
      await this.orderRepository.save(order);

      return {
        clientSecret: paymentIntent.client_secret,
        orderId: order.id,
      };
    } catch (error) {
      throw new BadRequestException('Failed to create payment intent');
    }
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');

    try {
      const event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata.orderId;
    
    const order = await this.orderRepository.findOne({ 
      where: { id: orderId } 
    });

    if (order) {
      order.status = OrderStatus.PROCESSING;
      await this.orderRepository.save(order);
    }
  }

  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata.orderId;
    
    const order = await this.orderRepository.findOne({ 
      where: { id: orderId } 
    });

    if (order) {
      order.status = OrderStatus.CANCELLED;
      await this.orderRepository.save(order);
    }
  }
}
