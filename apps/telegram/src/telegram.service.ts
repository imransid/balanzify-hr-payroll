import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { MailerService } from '@nestjs-modules/mailer';
import { sendMail } from '../../../utils/email.util';
dotenv.config();

const TelegramBot = require('node-telegram-bot-api');

@Injectable()
export class TelegramService {
  private botToken = process.env.TELEGRAM_TOKEN;

  private readonly BASE_URL = 'https://gatewayapi.telegram.org/';
  private readonly TOKEN = process.env.API_TOKEN;

  private readonly HEADERS = {
    Authorization: `Bearer ${this.TOKEN}`,
    'Content-Type': 'application/json',
  };

  private apiUrl = `https://api.telegram.org/bot${this.botToken}`;
  private bot = new TelegramBot(this.botToken, { polling: true });
  private paidUsers = new Map();
  constructor(private readonly mailService: MailerService) {
    this.handlePreCheckoutQuery();
    this.handleSuccessfulPayment();
  }

  private handlePreCheckoutQuery() {
    this.bot.on('pre_checkout_query', (query) => {
      this.bot.answerPreCheckoutQuery(query.id, true).catch(() => {
        console.error('answerPreCheckoutQuery failed');
      });
    });
  }

  // private handleSuccessfulPayment() {
  //   this.bot.on('message', (msg) => {
  //     if (msg.successful_payment) {
  //       const userId = msg.from.id;
  //       this.paidUsers.set(
  //         userId,
  //         msg.successful_payment.telegram_payment_charge_id,
  //       );
  //     }
  //   });
  // }

  private handleSuccessfulPayment() {
    this.bot.on('message', (msg) => {
      if (msg.successful_payment) {
        const userId = msg.from.id;
        const paymentInfo = msg.successful_payment;

        console.log('✅ Payment Successful!');
        console.log(`User ID: ${userId}`);
        console.log(
          `Amount Paid: ${paymentInfo.total_amount / 100} ${paymentInfo.currency}`,
        );
        console.log(`Invoice Payload: ${paymentInfo.invoice_payload}`);
        console.log(
          `Telegram Payment Charge ID: ${paymentInfo.telegram_payment_charge_id}`,
        );

        // Store the payment info in a Map
        this.paidUsers.set(userId, paymentInfo.telegram_payment_charge_id);

        const paymentData = {
          userId,
          telegramPaymentChargeId:
            msg.successful_payment.telegram_payment_charge_id,
          providerPaymentChargeId:
            msg.successful_payment.provider_payment_charge_id,
          currency: msg.successful_payment.currency,
          totalAmount: msg.successful_payment.total_amount / 100, // Convert to normal value
          status: 'PAID',
        };


        

        // Send confirmation message to the user
        this.bot.sendMessage(
          userId,
          `🎉 Thank you! Your payment of ${paymentInfo.total_amount / 100} ${paymentInfo.currency} has been received successfully.`,
        );

        // (Optional) Call an API or database to save the payment details
      }
    });
  }

  async createInvoiceLink(
    payload: string,
    currency: string,
    prices: { label: string; amount: number }[],
  ) {
    try {
      const { label, amount } = prices[0];
      const title = `item for ${amount}`;
      const description = `Buying an item for ${amount} stars.`;
      const invoiceLink = await this.bot.createInvoiceLink(
        title,
        description,
        payload,
        this.botToken,
        currency,
        prices,
      );
      return invoiceLink;
    } catch (error) {
      console.error('Error creating invoice link:', error);
      throw error;
    }
  }
  async setWebhook() {
    const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;
    try {
      await axios.post(`${this.apiUrl}/setWebhook`, {
        url: webhookUrl,
      });
      console.log('Webhook set successfully');
    } catch (error) {
      console.error('Error setting webhook:', error);
    }
  }

  async sendVerificationCode(phone: string): Promise<any> {
    const endpoint = 'sendVerificationMessage'; // Replace with actual API endpoint
    const jsonBody = {
      phone_number: phone,
      code_length: 6,
      ttl: 300, // OTP expires in 5 minutes
      payload: 'otp_verification',
      callback_url: 'https://pokerapi.jumatechs.xyz/telegram/webhook/otp',
    };

    try {
      const response = await axios.post(
        `${this.BASE_URL}${endpoint}`,
        jsonBody,
        { headers: this.HEADERS },
      );

      console.log('response', response);

      return response.data; // Returns { ok: true, request_id: "123456" }
    } catch (error) {
      console.log('error', error);
      throw new HttpException(
        error.response?.data?.error || 'Failed to send verification code',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Verifies the OTP received from the user.
   */
  async verifyOtp(requestId: string, code: string): Promise<boolean> {
    const endpoint = 'checkVerificationStatus'; // Replace with actual API endpoint
    const jsonBody = { request_id: requestId, code };

    try {
      const response = await axios.post(
        `${this.BASE_URL}${endpoint}`,
        jsonBody,
        { headers: this.HEADERS },
      );

      return response.data?.result.verification_status?.status === 'code_valid';
    } catch (error) {
      console.log('error', error);

      throw new HttpException(
        error.response?.data || 'OTP verification failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async sendMail(email: string, subject: string, body: string) {
    console.log('email, subject, body,', email, subject, body);
    sendMail(email, subject, body, this.mailService);
  }
}
