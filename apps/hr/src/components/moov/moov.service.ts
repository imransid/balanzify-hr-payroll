// // import { Injectable } from "@nestjs/common";
// // import axios from "axios";

// // @Injectable()
// // export class MoovService {

// //   // private baseUrl = process.env.MOOV_BASE_URL;
// //   // private apiKey = process.env.MOOV_API_KEY;
// //   // private get headers() {
// //   //   return {
// //   //     Authorization: `Bearer ${this.apiKey}`,
// //   //     "Content-Type": "application/json",
// //   //   };
// //   // }
// //   // async listPaymentMethods(accountId: string) {
// //   //   const url = `${this.baseUrl}/accounts/${accountId}/payment-methods`;
// //   //   const { data } = await axios.get(url, { headers: this.headers });
// //   //   return data;
// //   // }
// //   // async createTransfer(
// //   //   sourcePaymentMethodId: string,
// //   //   destinationPaymentMethodId: string,
// //   //   amount: number,
// //   //   currency = "USD",
// //   //   description = "Transfer via Moov"
// //   // ) {
// //   //   const payload = {
// //   //     amount: {
// //   //       value: amount,
// //   //       currency,
// //   //     },
// //   //     source: {
// //   //       paymentMethodId: sourcePaymentMethodId,
// //   //     },
// //   //     destination: {
// //   //       paymentMethodId: destinationPaymentMethodId,
// //   //     },
// //   //     description,
// //   //   };
// //   //   const { data } = await axios.post(`${this.baseUrl}/transfers`, payload, {
// //   //     headers: this.headers,
// //   //   });
// //   //   return data;
// //   // }
// //   // async getTransfer(transferId: string) {
// //   //   const { data } = await axios.get(
// //   //     `${this.baseUrl}/transfers/${transferId}`,
// //   //     {
// //   //       headers: this.headers,
// //   //     }
// //   //   );
// //   //   return data;
// //   // }
// // }

// import { Injectable, OnModuleInit } from "@nestjs/common";
// import { Moov } from "@moovio/sdk";
// import axios from "axios";

// import { ConfigService } from "@nestjs/config";

// @Injectable()
// export class MoovService implements OnModuleInit {
//   private moovClient: Moov;

//   constructor() {
//     this.generateAccessToken();
//     this.moovClient = new Moov({
//       xMoovVersion: "v2024.01.00",
//       security: {
//         username: process.env.MOOV_USER_NAME || "",
//         password: process.env.MOOV_USER_PASSWORD || "",
//       },
//     });
//   }

//   async onModuleInit() {
//     const connected = await this.isConnected();

//     console.log(
//       "🔐 Moov credentials",
//       process.env.MOOV_USER_NAME,
//       process.env.MOOV_USER_PASSWORD
//     );

//     if (!connected) {
//       console.warn("⚠️ Moov is NOT connected. Check credentials or network.");
//     } else {
//       console.log("✅ Moov is connected successfully.");
//     }
//   }

//   async generateAccessToken(): Promise<string> {
//     const clientId = process.env.MOOV_CLIENT_ID;
//     const clientSecret = process.env.MOOV_CLIENT_SECRET;
//     const scope = process.env.MOOV_SCOPE;

//     const response = await axios.post(
//       "https://api.moov.io/oauth2/token",
//       new URLSearchParams({
//         grant_type: "client_credentials",
//         client_id: clientId,
//         client_secret: clientSecret,
//         scope,
//       }),
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     );

//     console.log("Generated Moov access token:", response);

//     return response.data.access_token;
//   }

//   async isConnected(): Promise<boolean> {
//     try {
//       await this.moovClient.ping.ping({});
//       return true;
//     } catch (error) {
//       console.error("Moov connection check failed:", error.message);
//       return false;
//     }
//   }

//   async createBusinessAccount(legalBusinessName: string) {
//     return this.moovClient.accounts.create({
//       accountType: "business",
//       profile: {
//         business: {
//           legalBusinessName,
//         },
//       },
//     });
//   }

//   // async createTransfer(
//   //   moovAccountID: string, // This is the Moov account to initiate the transfer on
//   //   sourcePaymentMethodID: string,
//   //   destinationPaymentMethodID: string,
//   //   amount: number
//   // ): Promise<any> {
//   //   const payload: CreateTransferRequest = {
//   //     accountID: moovAccountID, // Required root-level Moov account ID
//   //     source: {
//   //       paymentMethodID: sourcePaymentMethodID,
//   //     },
//   //     destination: {
//   //       paymentMethodID: destinationPaymentMethodID,
//   //     },
//   //     amount: {
//   //       currency: "USD",
//   //       value: amount.toFixed(2),
//   //     },
//   //   };

//   //   return this.moovClient.transfers.create(payload);
//   // }

//   async getTransfer(accountId: string, transferId: string) {
//     return this.moovClient.transfers.get({
//       accountID: accountId,
//       transferID: transferId,
//     });
//   }
// }

import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { Moov } from "@moovio/sdk";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MoovService implements OnModuleInit {
  private moovClient: Moov;
  private readonly logger = new Logger(MoovService.name);

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.moovClient = new Moov({
      xMoovVersion: this.configService.get("MOOV_VERSION"),
      security: {
        username: this.configService.get("MOOV_USERNAME"),
        password: this.configService.get("MOOV_PASSWORD"),
      },
    });

    await this.getAccessToken(); // Optional: call on boot
  }

  async getAccessToken() {
    try {
      const tokenResponse =
        await this.moovClient.authentication.createAccessToken({
          grantType: "client_credentials",
          clientId: this.configService.get("MOOV_CLIENT_ID"),
          clientSecret: this.configService.get("MOOV_CLIENT_SECRET"),
          scope: this.configService.get("MOOV_SCOPE"),
          // refreshToken: 'optional_if_using_refresh_flow'
        });

      console.log("Moov Access Token:", tokenResponse);

      this.logger.log(`Access Token: ${tokenResponse}`);
      return tokenResponse;
    } catch (error) {
      this.logger.error("Failed to get Moov access token", error);
      throw error;
    }
  }

  getMoovClient(): Moov {
    return this.moovClient;
  }
}
