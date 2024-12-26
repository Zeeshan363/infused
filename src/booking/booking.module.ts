import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import Stripe from 'stripe';

@Module({
  imports: [ConfigModule], // Ensure ConfigModule is imported for ConfigService
  controllers: [BookingController],
  providers: [
    BookingService,
    {
      provide: 'STRIPE_CLIENT', // Use a consistent string token for the Stripe client
      useFactory: (configService: ConfigService) => {
        return new Stripe(configService.get<string>('STRIPE_SECRET_KEY'), {
          apiVersion: '2024-11-20.acacia', // Specify the Stripe API version
        });
      },
      inject: [ConfigService], // Dependency injection for ConfigService
    },
  ],
  exports: ['STRIPE_CLIENT'], // Export the Stripe client for use in other modules
})
export class BookingModule {}
