import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';

const types = {
  plink_1OgBcWEQwGRtgrzo1BhyKpZ2: '1',
  plink_1OgCA7EQwGRtgrzo697BLDxI: '12',
};

const subscriptionDurationInMs = {
  1: 30 * 24 * 60 * 60 * 1000,
  12: 365 * 24 * 60 * 60 * 1000,
};

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  private readonly logger: Logger;
  constructor(private readonly prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
    this.logger = new Logger('StripeService');
  }

  async checkSession(session_id: string, user_id: string) {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(session_id);

      if (session.status === 'complete') {
        const existingSubscription = await this.prisma.subscription.findFirst({
          where: {
            stripe_session_id: session.id,
          },
        });

        if (existingSubscription) {
          return existingSubscription;
        }
        const date =
          subscriptionDurationInMs[types[session.payment_link.toString()]];
        
        const expires_at = new Date(Date.now() + date);

        const subscription = await this.prisma.subscription.create({
          data: {
            user_id,
            expires_at,
            type: types[session.payment_link.toString()],
            stripe_session_id: session.id,
          },
        });

        return subscription;
      }
    } catch (error) {
      console.log(error);
      this.logger.error(`Error checking session: ${session_id}`);
    }
  }
}
