import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingService {
  constructor(@Inject('STRIPE_CLIENT') private readonly stripeClient: Stripe) {}

  async createAdvancedPaymentLink(createBookingDto: CreateBookingDto) {
    const {
      paymentAmount,
      paymentCurrency,
      paymentDescription,
      addonDescription,
      addonAmount,
      serviceFeeDescription,
      serviceFeeAmount,
      enableShipping,
      successUrl,
      location,
      quantity,
    } = createBookingDto;

    try {
      // Validate required fields
      if (!paymentAmount || paymentAmount <= 0) {
        throw new BadRequestException('Invalid payment amount.');
      }
      if (!paymentCurrency) {
        throw new BadRequestException('Payment currency is required.');
      }
      if (!paymentDescription) {
        throw new BadRequestException('Payment description is required.');
      }

      // Create the main price
      const mainPrice = await this.stripeClient.prices.create({
        currency: paymentCurrency,
        product_data: {
          name: paymentDescription,
        },
        unit_amount: Math.round(paymentAmount * 100),
      });

      // Define the line items for the payment link
      const lineItems: Stripe.PaymentLinkCreateParams.LineItem[] = [
        { price: mainPrice.id, quantity: 1 },
      ];

      // Add optional add-on item
      if (addonAmount && addonAmount > 0) {
        const addonPrice = await this.stripeClient.prices.create({
          currency: paymentCurrency,
          product_data: {
            name: addonDescription,
          },
          unit_amount: Math.round(addonAmount * 100),
        });

        lineItems.push({ price: addonPrice.id, quantity: quantity });
      }

      // Add service fee
      if (serviceFeeAmount && serviceFeeAmount > 0) {
        const serviceFeePrice = await this.stripeClient.prices.create({
          currency: paymentCurrency,
          product_data: {
            name: serviceFeeDescription || 'Service Fee',
          },
          unit_amount: Math.round(serviceFeeAmount * 100),
        });

        lineItems.push({ price: serviceFeePrice.id, quantity: quantity });
      }

      // Create the payment link
      const paymentLink = await this.stripeClient.paymentLinks.create({
        line_items: lineItems,
        shipping_address_collection: enableShipping
          ? { allowed_countries: ['US', 'CA', 'GB', 'IN'] } // Customize allowed countries as needed
          : undefined,
        allow_promotion_codes: true, // Enable coupon codes
        metadata: {
          location,
        },
        custom_fields: [
          {
            key: 'location',
            label: { type: 'custom', custom: 'Location (City or ZIP Code)' },
            type: 'text',
          },
        ],
        after_completion: {
          type: 'redirect',
          redirect: {
            url: successUrl,
          },
        },
      });

      return {
        success: true,
        message: 'Advanced payment link created successfully.',
        paymentLink: paymentLink.url,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to create payment link: ${error.message}`,
      );
    }
  }
}
