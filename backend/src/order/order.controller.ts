import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Req,
  Query,
  ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(
    @Req() req, 
    @Body(ValidationPipe) createOrderDto: CreateOrderDto
  ) {
    return this.orderService.create(createOrderDto, req.user.id);
  }

  @Get()
  findAll(
    @Req() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ) {
    return this.orderService.findAll(req.user.id, page, limit);
  }

  @Get(':id')
  findOne(
    @Req() req, 
    @Param('id') id: string
  ) {
    return this.orderService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Req() req,
    @Param('id') id: string, 
    @Body(ValidationPipe) updateOrderDto: UpdateOrderDto
  ) {
    return this.orderService.update(id, req.user.id, updateOrderDto);
  }

  @Delete(':id')
  cancel(
    @Req() req, 
    @Param('id') id: string
  ) {
    return this.orderService.cancel(id, req.user.id);
  }
}
