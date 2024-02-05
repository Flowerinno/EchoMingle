import { Controller, Get, Query } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Get('session')
  checkSession(@Query() query: { session_id: string; user_id: string }) {
    return this.stripeService.checkSession(query.session_id, query.user_id);
  }
}
