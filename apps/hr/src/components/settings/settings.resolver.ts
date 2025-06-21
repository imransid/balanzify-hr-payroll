import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { SettingsService } from "./settings.service";
import { SettingsPaginatedResult } from "../entities/settings.entity";
import { NotFoundException } from "@nestjs/common";
import { GraphQLException } from "exceptions/graphql-exception";
import {
  CreateNotificationSettingsInput,
  UpdateNotificationSettingsInput,
} from "../dto/NotificationSettingsInput";
import {
  CreateEmployeeProfilePermissionsInput,
  UpdateEmployeeProfilePermissionsInput,
} from "../dto/EmployeeProfilePermissionsInput";
import {
  CreateBusinessBankAccountInput,
  UpdateBusinessBankAccountInput,
} from "../dto/BusinessBankAccountInput";
import {
  CreatePrincipalOfficerInput,
  UpdatePrincipalOfficerInput,
} from "../dto/PrincipalOfficerInput";

import {
  CreatePrintingOptionsInput,
  UpdatePrintingOptionsInput,
} from "../dto/PrintingOptionsInput";

import {
  CreateDirectDepositOptionsInput,
  UpdateDirectDepositOptionsInput,
} from "../dto/DirectDepositOptionsInput";

import {
  CreateContactInfoInput,
  UpdateContactInfoInput,
} from "../dto/ContactInfoInput";

@Resolver(() => SettingsPaginatedResult)
export class SettingsResolver {
  constructor(private readonly settingsService: SettingsService) {}

  @Mutation(() => SettingsPaginatedResult)
  async CreateNotificationSettings(
    @Args("notification") notification: CreateNotificationSettingsInput
  ): Promise<SettingsPaginatedResult> {
    try {
      return await this.settingsService.createNotificationSettings(
        notification
      );
    } catch (error) {
      throw new GraphQLException(
        "Failed to create notification settings",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => SettingsPaginatedResult)
  async CreateEmployeeProfilePermissions(
    @Args("employeeProfile")
    employeeProfile: CreateEmployeeProfilePermissionsInput
  ): Promise<SettingsPaginatedResult> {
    try {
      return await this.settingsService.createEmployeeProfilePermissions(
        employeeProfile
      );
    } catch (error) {
      throw new GraphQLException(
        "Failed to create employee profile permissions",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => SettingsPaginatedResult)
  async CreateBusinessBankAccount(
    @Args("businessBank") businessBank: CreateBusinessBankAccountInput
  ): Promise<SettingsPaginatedResult> {
    try {
      return await this.settingsService.createBusinessBankAccount(businessBank);
    } catch (error) {
      throw new GraphQLException(
        "Failed to create business bank account",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => SettingsPaginatedResult)
  async CreatePrincipalOfficer(
    @Args("principalOfficer") principalOfficer: CreatePrincipalOfficerInput
  ): Promise<SettingsPaginatedResult> {
    try {
      return await this.settingsService.createPrincipalOfficer(
        principalOfficer
      );
    } catch (error) {
      throw new GraphQLException(
        "Failed to create principal officer",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => SettingsPaginatedResult)
  async CreatePrintingOptions(
    @Args("printing") printing: CreatePrintingOptionsInput
  ): Promise<SettingsPaginatedResult> {
    try {
      return await this.settingsService.createPrintingOptions(printing);
    } catch (error) {
      throw new GraphQLException(
        "Failed to create printing options",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => SettingsPaginatedResult)
  async CreateDirectDepositOptions(
    @Args("directDeposit") directDeposit: CreateDirectDepositOptionsInput
  ): Promise<SettingsPaginatedResult> {
    try {
      return await this.settingsService.createDirectDepositOptions(
        directDeposit
      );
    } catch (error) {
      throw new GraphQLException(
        "Failed to create direct deposit options",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => SettingsPaginatedResult)
  async CreateContactInfo(
    @Args("contact") contact: CreateContactInfoInput
  ): Promise<SettingsPaginatedResult> {
    try {
      return await this.settingsService.createContactInfo(contact);
    } catch (error) {
      throw new GraphQLException(
        "Failed to create contact info",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => SettingsPaginatedResult)
  async updateSettings(
    @Args("id", { type: () => Int }) id: number,
    @Args("notification", { nullable: true })
    notification?: UpdateNotificationSettingsInput,
    @Args("employeeProfile", { nullable: true })
    employeeProfile?: UpdateEmployeeProfilePermissionsInput,
    @Args("businessBank", { nullable: true })
    businessBank?: UpdateBusinessBankAccountInput,
    @Args("principalOfficer", { nullable: true })
    principalOfficer?: UpdatePrincipalOfficerInput,
    @Args("printing", { nullable: true }) printing?: UpdatePrintingOptionsInput,
    @Args("directDeposit", { nullable: true })
    directDeposit?: UpdateDirectDepositOptionsInput,
    @Args("contact", { nullable: true }) contact?: UpdateContactInfoInput
  ): Promise<SettingsPaginatedResult> {
    try {
      return await this.settingsService.update(
        id,
        notification,
        employeeProfile,
        businessBank,
        principalOfficer,
        printing,
        directDeposit,
        contact
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Settings record with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to update settings record",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => SettingsPaginatedResult)
  async settings(
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number
  ): Promise<SettingsPaginatedResult> {
    try {
      return await this.settingsService.findAllPaginated(page, limit);
    } catch (error) {
      throw new GraphQLException(
        "Failed to fetch settings records",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => SettingsPaginatedResult)
  async setting(
    @Args("id", { type: () => Int }) id: number
  ): Promise<SettingsPaginatedResult> {
    try {
      return await this.settingsService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Settings record with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to fetch settings record",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => SettingsPaginatedResult)
  async removeSettings(
    @Args("id", { type: () => Int }) id: number
  ): Promise<SettingsPaginatedResult> {
    try {
      return await this.settingsService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Settings record with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to remove settings record",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => SettingsPaginatedResult)
  async searchSettings(
    @Args("profileId", { type: () => String }) profileId: number,
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number
  ): Promise<SettingsPaginatedResult> {
    try {
      return await this.settingsService.searchByProfileId(
        profileId,
        page,
        limit
      );
    } catch (error) {
      throw new GraphQLException(
        "Failed to search settings records",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }
}
