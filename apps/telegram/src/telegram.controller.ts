import { Controller, Post, Body, Get } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Get()
  getHello(): string {
    return 'Hello telegram..';
  }

  @Post('createInvoiceLink')
  async createInvoiceLink(
    @Body()
    body: {
      payload: string;
      currency: string;
      prices: { label: string; amount: number }[];
    },
  ) {
    const { payload, currency, prices } = body;
    try {
      const invoiceLink = await this.telegramService.createInvoiceLink(
        payload,
        currency,
        prices,
      );
      return { success: true, invoiceLink };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Post('sendOtp')
  async sendOtp(@Body() body: { phone: string }) {
    const result = await this.telegramService.sendVerificationCode(body.phone);
    return result?.ok
      ? {
          success: true,
          message: 'OTP sent successfully',
          requestId: result.result.request_id,
        }
      : { success: false, message: 'Failed to send OTP' };
  }

  @Post('verifyOtp')
  async verifyOtp(@Body() body: { requestId: string; code: string }) {
    const isValid = await this.telegramService.verifyOtp(
      body.requestId,
      body.code,
    );

    return isValid
      ? { success: true, message: 'OTP verified successfully' }
      : { success: false, message: 'Invalid OTP' };
  }

  @Post('webhook')
  async handleWebhook(@Body() body: any) {
    console.log('Webhook received:', body);
    // Handle webhook logic, like handling payment status or user commands
  }

  @Post('webhook/otp')
  async handleOtpWebhook(@Body() body: any) {
    console.log('Received OTP verification webhook:', body);

    if (!body || !body.request_id || !body.verification_status) {
      return { success: false, message: 'Invalid webhook payload' };
    }

    if (body.verification_status.status === 'code_valid') {
      console.log(
        `OTP verification successful for request ID: ${body.request_id}`,
      );
      return {
        success: true,
        message: 'OTP verified successfully via webhook',
      };
    } else {
      console.log(`OTP verification failed for request ID: ${body.request_id}`);
      return { success: false, message: 'OTP verification failed' };
    }
  }

  @Post('sendMail')
  async sendMail(
    @Body() body: { subject: string; message: string; email: string },
  ) {
    const { subject, message, email } = body;

    if (!subject || !message || !email) {
      return { success: false, message: 'Missing required fields' };
    }

    try {
      await this.telegramService.sendMail(email, subject, message);
      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to send email' };
    }
  }
}
