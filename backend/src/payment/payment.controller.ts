import { 
  Controller, 
  Post, 
  Body, 
  Headers, 
  Req, 
  UseGuards 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentService } from './payment.service';
import { OrderService } from '../order/order.service';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly orderService: OrderService,
  ) {}

  @Post('create-intent')
  @UseGuards(AuthGuard('jwt'))
  async createPaymentIntent(
    @Req() req,
    @Body('orderId') orderId: string
  ) {
    // Fetch the order to ensure it belongs to the user
    const order = await this.orderService.findOne(orderId, req.user.id);
    
    return this.paymentService.createPaymentIntent(order);
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req,
    @Headers('stripe-signature') signature: string
  ) {
    return this.paymentService.handleWebhook(req.rawBody, signature);
  }
}
