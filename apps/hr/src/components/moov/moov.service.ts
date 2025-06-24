import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class MoovService {
  private baseUrl = process.env.MOOV_BASE_URL;
  private apiKey = process.env.MOOV_API_KEY;

  private get headers() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };
  }

  async listPaymentMethods(accountId: string) {
    const url = `${this.baseUrl}/accounts/${accountId}/payment-methods`;
    const { data } = await axios.get(url, { headers: this.headers });
    return data;
  }

  async createTransfer(
    sourcePaymentMethodId: string,
    destinationPaymentMethodId: string,
    amount: number,
    currency = "USD",
    description = "Transfer via Moov"
  ) {
    const payload = {
      amount: {
        value: amount,
        currency,
      },
      source: {
        paymentMethodId: sourcePaymentMethodId,
      },
      destination: {
        paymentMethodId: destinationPaymentMethodId,
      },
      description,
    };

    const { data } = await axios.post(`${this.baseUrl}/transfers`, payload, {
      headers: this.headers,
    });

    return data;
  }

  async getTransfer(transferId: string) {
    const { data } = await axios.get(
      `${this.baseUrl}/transfers/${transferId}`,
      {
        headers: this.headers,
      }
    );
    return data;
  }
}
