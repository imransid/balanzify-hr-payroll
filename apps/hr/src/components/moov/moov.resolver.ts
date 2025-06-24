import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { MoovService } from "./moov.service";

@Resolver()
export class MoovResolver {
  constructor(private readonly moovService: MoovService) {}

  @Mutation(() => String)
  async transferMoney(
    @Args("sourceId") sourceId: string,
    @Args("destinationId") destinationId: string,
    @Args("amount") amount: number
  ): Promise<string> {
    const result = await this.moovService.createTransfer(
      sourceId,
      destinationId,
      amount
    );
    return result.id; // transferId
  }

  @Query(() => String)
  async getTransfer(@Args("transferId") transferId: string): Promise<string> {
    const result = await this.moovService.getTransfer(transferId);
    return JSON.stringify(result);
  }
}
