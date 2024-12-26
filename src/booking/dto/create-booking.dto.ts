import { IsString, IsNumber, IsDate, IsOptional, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsDate()
  @IsNotEmpty()
  dateofBirth: Date;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsOptional()
  appointmentAddress?: string;

  @IsString()
  @IsOptional()
  shippingAddress?: string;

  @IsNumber()
  @IsNotEmpty()
  paymentAmount: number;

  @IsString()
  @IsNotEmpty()
  paymentCurrency: string; // e.g., "USD", "EUR"

  @IsString()
  @IsOptional()
  promotionCode?: string; // Optional coupon or discount code




  @IsString()
  @IsOptional()
  paymentDescription?: string; // Description of the payment (e.g., "Service Booking")

  @IsString()
  @IsOptional()
  successUrl?: string; // Redirect URL after successful payment

  @IsString()
  @IsOptional()
  cancelUrl?: string; // Redirect URL if payment is canceled

  @IsOptional()
  enableShipping?: boolean; // Enable or disable shipping address collection

  @IsNumber()
  @IsOptional()
  serviceFeeAmount?: number; // Optional service fee

  @IsString()
  @IsOptional()
  serviceFeeDescription?: string; // Description of the service fee

  @IsNumber()
  @IsOptional()
  addonAmount?: number; // Optional add-on item amount

  @IsString()
  @IsOptional()
  addonDescription?: string; // Description of the add-on item

  @IsNumber()
  @IsNotEmpty()
  quantity: number; // Number of items or services booked
}
