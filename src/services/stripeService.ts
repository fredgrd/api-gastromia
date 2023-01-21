import Stripe from "stripe";
import { ICard } from "../models/cardModel";

class StripeService {
  private readonly stripeKey: string;
  private readonly stripe: Stripe;

  constructor() {
    this.stripeKey = process.env.STRIPE_SECRET || "";
    this.stripe = new Stripe(this.stripeKey, { apiVersion: "2022-11-15" });
  }

  async createCustomer(id: string): Promise<string | null> {
    const params: Stripe.CustomerCreateParams = {
      description: id,
    };

    try {
      const customer: Stripe.Customer = await this.stripe.customers.create(
        params
      );
      return customer.id;
    } catch (error) {
      console.log(`CreateCustomer error: ${error}`);
      return null;
    }
  }

  async setupIntent(id: string): Promise<string | null> {
    try {
      const intent: Stripe.SetupIntent = await this.stripe.setupIntents.create({
        customer: id,
      });
      return intent.client_secret;
    } catch (error) {
      console.log(`SetupIntent error: ${error}`);
      return null;
    }
  }

  async paymentIntent(
    id: string,
    amount: number
  ): Promise<{ secret: string; id: string } | null> {
    try {
      const intent: Stripe.PaymentIntent =
        await this.stripe.paymentIntents.create({
          customer: id,
          amount: amount / 10,
          currency: "eur",
        });

      if (intent.client_secret) {
        return { secret: intent.client_secret, id: intent.id };
      } else {
        return null;
      }
    } catch (error) {
      console.log(`PaymentIntent error: ${error}`);
      return null;
    }
  }

  async paymentMethods(id: string): Promise<ICard[]> {
    try {
      const methods = await this.stripe.paymentMethods.list({
        customer: id,
        type: "card",
      });

      const filteredMethods = methods.data.filter(
        (method) => method.card !== undefined
      );

      const mappedMethods: ICard[] = filteredMethods.map((method) => ({
        id: method.id,
        brand: method.card!.brand,
        last4: method.card!.last4,
        exp_month: method.card!.exp_month,
        exp_year: method.card!.exp_year,
      }));

      return mappedMethods;
    } catch (error) {
      console.log(`PaymentMethods error: ${error}`);
      return [];
    }
  }

  async detach(id: string): Promise<boolean> {
    try {
      const _ = await this.stripe.paymentMethods.detach(id);

      return true;
    } catch (error) {
      console.log(`DetachPaymentMethod error: ${error}`);
      return false;
    }
  }

  async fetchPaymentIntent(id: string): Promise<Stripe.PaymentIntent | null> {
    try {
      const intent = await this.stripe.paymentIntents.retrieve(id);
      return intent;
    } catch (error) {
      console.log(`FetchPaymentMethod error: ${error}`);
      return null;
    }
  }

  async refundPaymentIntent(id: string): Promise<Stripe.Refund | null> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: id,
      });
      return refund;
    } catch (error) {
      console.log(`RefundPaymentIntent error: ${error}`);
      return null;
    }
  }
}

export default StripeService;
