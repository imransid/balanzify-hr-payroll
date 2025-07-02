// // import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
// // import { MoovService } from "./moov.service";

// // @Resolver()
// // export class MoovResolver {
// //   constructor(private readonly moovService: MoovService) {}

// //   @Mutation(() => String)
// //   async transferMoney(
// //     @Args("sourceId") sourceId: string,
// //     @Args("destinationId") destinationId: string,
// //     @Args("amount") amount: number
// //   ): Promise<string> {
// //     const result = await this.moovService.createTransfer(
// //       sourceId,
// //       destinationId,
// //       amount
// //     );
// //     return result.id; // transferId
// //   }

// //   @Query(() => String)
// //   async getTransfer(@Args("transferId") transferId: string): Promise<string> {
// //     const result = await this.moovService.getTransfer(transferId);
// //     return JSON.stringify(result);
// //   }
// // }

// import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
// import { MoovService } from "./moov.service";

// @Resolver()
// export class MoovResolver {
//   constructor(private readonly moovService: MoovService) {}

//   @Query(() => Boolean)
//   async isMoovConnected(): Promise<boolean> {
//     return this.moovService.isConnected();
//   }

//   @Mutation(() => String)
//   async createBusinessAccount(
//     @Args("legalBusinessName") legalBusinessName: string
//   ): Promise<string> {
//     const account =
//       await this.moovService.createBusinessAccount(legalBusinessName);
//     return JSON.stringify(account);
//   }

//   // @Mutation(() => String)
//   // async transferMoney(
//   //   @Args("sourceId") sourceId: string,
//   //   @Args("destinationId") destinationId: string,
//   //   @Args("amount") amount: number
//   // ): Promise<string> {
//   //   const result = await this.moovService.createTransfer(
//   //     sourceId,
//   //     destinationId,
//   //     amount
//   //   );
//   //   return result.id;
//   // }

//   @Query(() => String)
//   async getTransfer(
//     @Args("accountId") accountId: string,
//     @Args("transferId") transferId: string
//   ): Promise<string> {
//     const result = await this.moovService.getTransfer(accountId, transferId);
//     return JSON.stringify(result);
//   }
// }

import { Resolver, Query } from "@nestjs/graphql";
import { MoovService } from "./moov.service";
import { Logger } from "@nestjs/common";

@Resolver()
export class MoovResolver {
  private readonly logger = new Logger(MoovResolver.name);

  constructor(private readonly moovService: MoovService) {}

  @Query(() => String)
  async getMoovAccessToken(): Promise<string> {
    try {
      const tokenResponse = await this.moovService.getAccessToken();
      console.log("Moov Access Token:", tokenResponse);
      return "tokenResponse";
    } catch (error) {
      this.logger.error("Error fetching Moov Access Token", error);
      throw new Error("Unable to retrieve Moov access token");
    }
  }
}
