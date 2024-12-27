import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'localhost',
      port: 1025, // Standard port for local email testing
      secure: false,
      ignoreTLS: true, // For local testing
    });
  }

  async sendClientConfirmation(clientEmail: string, appointmentDetails: any) {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
          }
          .header {
            background: linear-gradient(135deg, #00d2ff 0%, #9d5bfe 100%);
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            padding: 20px;
            background: #f9f9f9;
            border: 1px solid #eee;
          }
          .appointment-details {
            background: white;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
          }
          .footer {
            text-align: center;
            padding: 20px;
            font-size: 14px;
            color: #666;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: white;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">Infused</div>
          <p>Your Health, Our Priority</p>
        </div>
        
        <div class="content">
          <h2>Appointment Confirmation</h2>
          <p>Dear ${appointmentDetails.name},</p>
          <p>Your appointment has been successfully scheduled.</p>
          
          <div class="appointment-details">
            <h3>Appointment Details:</h3>
            <p><strong>Date:</strong> ${this.formatDate(appointmentDetails.appointmentDate)}</p>
            <p><strong>Time:</strong> ${appointmentDetails.startTime}</p>
            <p><strong>Location:</strong> ${appointmentDetails.location}</p>
          </div>
          
          <p>What to bring:</p>
          <ul>
            <li>Valid ID</li>
            <li>Insurance card (if applicable)</li>
            <li>List of current medications</li>
          </ul>
          
          <p>If you need to reschedule or have any questions, please contact us.</p>
        </div>
        
        <div class="footer">
          <p>A Seamless Experience from Click to Care Because Your Health Can't Wait.</p>
          <p>© 2024 Infused. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: 'infused@healthcare.com',
      to: clientEmail,
      subject: 'Your Infused Appointment Confirmation',
      html: htmlContent,
    });
  }

  async sendOwnerNotification(appointmentDetails: any) {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
          }
          .header {
            background: linear-gradient(135deg, #00d2ff 0%, #9d5bfe 100%);
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            padding: 20px;
            background: #f9f9f9;
            border: 1px solid #eee;
          }
          .appointment-details {
            background: white;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>New Appointment Alert</h2>
        </div>
        
        <div class="content">
          <p>A new appointment has been scheduled:</p>
          
          <div class="appointment-details">
            <p><strong>Patient Name:</strong> ${appointmentDetails.name}</p>
            <p><strong>Email:</strong> ${appointmentDetails.email}</p>
            <p><strong>Date:</strong> ${this.formatDate(appointmentDetails.appointmentDate)}</p>
            <p><strong>Time:</strong> ${appointmentDetails.startTime}</p>
            <p><strong>Location:</strong> ${appointmentDetails.location}</p>
          </div>
          
          <p>Please review and confirm this appointment.</p>
        </div>
      </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: 'infused@healthcare.com',
      to: 'zzeesarfraz786@gmail.com',
      subject: 'New Appointment Request',
      html: htmlContent,
    });
  }

  formatDate(providedDate) {
    const date = new Date(providedDate);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
