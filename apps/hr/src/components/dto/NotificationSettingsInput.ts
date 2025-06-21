import {
  InputType,
  Field,
  Int,
  PartialType,
  ObjectType,
} from "@nestjs/graphql";
import { IsOptional, IsBoolean, IsString, IsInt } from "class-validator";
import { NotificationSettings } from "../entities/settings.entity";

@InputType()
export class CreateNotificationSettingsInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  clientPaydayEmails?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  paydayReminders?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  reminderType?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  taxSetupReminders?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  companyId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  profileId?: number;
}

@InputType()
export class UpdateNotificationSettingsInput extends PartialType(
  CreateNotificationSettingsInput
) {
  @Field(() => Int)
  @IsInt()
  id: number;
}
