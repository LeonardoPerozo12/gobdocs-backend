import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {

    private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2026-03-25.dahlia',
    });

    async createPaymentIntent(amount: number) {
        return this.stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        });
  }
  async getPaymentIntent(paymentIntentId: string) {
        return this.stripe.paymentIntents.retrieve(paymentIntentId);
    }
}