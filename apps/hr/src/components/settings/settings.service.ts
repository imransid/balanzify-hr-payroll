import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service";
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
import {
  BusinessBankAccount,
  ContactInfo,
  DirectDepositOptions,
  EmployeeProfilePermissions,
  NotificationSettings,
  PrincipalOfficer,
  PrintingOptions,
  SettingsPaginatedResult,
} from "../entities/settings.entity";

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaHrService) {}

  async createNotificationSettings(input: CreateNotificationSettingsInput) {
    return this.prisma.notificationSettings.create({ data: input });
  }

  async createEmployeeProfilePermissions(
    input: CreateEmployeeProfilePermissionsInput
  ) {
    return this.prisma.employeeProfilePermissions.create({ data: input });
  }

  async createBusinessBankAccount(input: CreateBusinessBankAccountInput) {
    return this.prisma.businessBankAccount.create({ data: input });
  }

  async createPrincipalOfficer(input: CreatePrincipalOfficerInput) {
    return this.prisma.principalOfficer.create({ data: input });
  }

  async createPrintingOptions(input: CreatePrintingOptionsInput) {
    return this.prisma.printingOptions.create({ data: input });
  }

  async createDirectDepositOptions(input: CreateDirectDepositOptionsInput) {
    return this.prisma.directDepositOptions.create({ data: input });
  }

  async createContactInfo(input: CreateContactInfoInput) {
    return this.prisma.contactInfo.create({ data: input });
  }

  async update(
    id: number,
    notification: UpdateNotificationSettingsInput,
    employeeProfile: UpdateEmployeeProfilePermissionsInput,
    businessBank: UpdateBusinessBankAccountInput,
    principalOfficer: UpdatePrincipalOfficerInput,
    printing: UpdatePrintingOptionsInput,
    directDeposit: UpdateDirectDepositOptionsInput,
    contact: UpdateContactInfoInput
  ): Promise<SettingsPaginatedResult> {
    await this.findOne(id);

    const [notificationRecord] = await Promise.all([
      this.prisma.notificationSettings.update({
        where: { id },
        data: notification,
      }),
      this.prisma.employeeProfilePermissions.update({
        where: { id },
        data: employeeProfile,
      }),
      this.prisma.businessBankAccount.update({
        where: { id },
        data: businessBank,
      }),
      this.prisma.principalOfficer.update({
        where: { id },
        data: principalOfficer,
      }),
      this.prisma.printingOptions.update({ where: { id }, data: printing }),
      this.prisma.directDepositOptions.update({
        where: { id },
        data: directDeposit,
      }),
      this.prisma.contactInfo.update({ where: { id }, data: contact }),
    ]);

    return {
      items: [notificationRecord],
      totalCount: 1,
      totalPages: 1,
      currentPage: 1,
    };
  }

  async remove(id: number): Promise<SettingsPaginatedResult> {
    await this.findOne(id);

    const [deleted] = await Promise.all([
      this.prisma.notificationSettings.delete({ where: { id } }),
      this.prisma.employeeProfilePermissions.delete({ where: { id } }),
      this.prisma.businessBankAccount.delete({ where: { id } }),
      this.prisma.principalOfficer.delete({ where: { id } }),
      this.prisma.printingOptions.delete({ where: { id } }),
      this.prisma.directDepositOptions.delete({ where: { id } }),
      this.prisma.contactInfo.delete({ where: { id } }),
    ]);

    return {
      items: [deleted],
      totalCount: 1,
      totalPages: 1,
      currentPage: 1,
    };
  }

  async findAllPaginated(
    page = 1,
    limit = 10
  ): Promise<SettingsPaginatedResult> {
    const skip = (page - 1) * limit;

    const profileIds = await this.prisma.profile.findMany({
      skip,
      take: limit,
      select: { id: true },
    });

    const results: (
      | NotificationSettings
      | EmployeeProfilePermissions
      | BusinessBankAccount
      | PrincipalOfficer
      | PrintingOptions
      | DirectDepositOptions
      | ContactInfo
    )[] = [];

    for (const { id } of profileIds) {
      const [
        notificationSettings,
        employeeProfilePermissions,
        businessBankAccount,
        principalOfficer,
        printingOptions,
        directDepositOptions,
        contactInfo,
      ] = await Promise.all([
        this.prisma.notificationSettings.findFirst({
          where: { profileId: id },
        }),
        this.prisma.employeeProfilePermissions.findFirst({
          where: { profileId: id },
        }),
        this.prisma.businessBankAccount.findFirst({ where: { profileId: id } }),
        this.prisma.principalOfficer.findFirst({ where: { profileId: id } }),
        this.prisma.printingOptions.findFirst({ where: { profileId: id } }),
        this.prisma.directDepositOptions.findFirst({
          where: { profileId: id },
        }),
        this.prisma.contactInfo.findFirst({ where: { profileId: id } }),
      ]);

      results.push(
        ...[
          notificationSettings,
          employeeProfilePermissions,
          businessBankAccount,
          principalOfficer,
          printingOptions,
          directDepositOptions,
          contactInfo,
        ].filter((item): item is typeof item => !!item) // filter out nulls
      );
    }

    const totalCount = await this.prisma.profile.count();

    return new SettingsPaginatedResult(
      results,
      Math.ceil(totalCount / limit),
      page,
      results.length
    );
  }

  async findOne(profileId: number): Promise<SettingsPaginatedResult> {
    const [
      notificationSettings,
      employeeProfilePermissions,
      businessBankAccount,
      principalOfficer,
      printingOptions,
      directDepositOptions,
      contactInfo,
    ] = await Promise.all([
      this.prisma.notificationSettings.findFirst({ where: { profileId } }),
      this.prisma.employeeProfilePermissions.findFirst({
        where: { profileId },
      }),
      this.prisma.businessBankAccount.findFirst({ where: { profileId } }),
      this.prisma.principalOfficer.findFirst({ where: { profileId } }),
      this.prisma.printingOptions.findFirst({ where: { profileId } }),
      this.prisma.directDepositOptions.findFirst({ where: { profileId } }),
      this.prisma.contactInfo.findFirst({ where: { profileId } }),
    ]);

    const combined = {
      profileId,
      notificationSettings,
      employeeProfilePermissions,
      businessBankAccount,
      principalOfficer,
      printingOptions,
      directDepositOptions,
      contactInfo,
    };

    const items = [
      notificationSettings,
      employeeProfilePermissions,
      businessBankAccount,
      principalOfficer,
      printingOptions,
      directDepositOptions,
      contactInfo,
    ].filter((item) => item !== null);

    return new SettingsPaginatedResult(items, 1, 1, items.length);
  }

  async search(
    query: string,
    page = 1,
    limit = 10
  ): Promise<SettingsPaginatedResult> {
    const skip = (page - 1) * limit;
    const [items, totalCount] = await Promise.all([
      this.prisma.settings.findMany({
        where: {
          contact: {
            emailAddress: { contains: query, mode: "insensitive" },
          },
        },
        skip,
        take: limit,
      }),
      this.prisma.settings.count({
        where: {
          contact: {
            emailAddress: { contains: query, mode: "insensitive" },
          },
        },
      }),
    ]);

    return new SettingsPaginatedResult(
      items,
      Math.ceil(totalCount / limit),
      page,
      totalCount
    );
  }
}
