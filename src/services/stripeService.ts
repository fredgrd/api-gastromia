import Stripe from "stripe";

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
}

export default StripeService;
