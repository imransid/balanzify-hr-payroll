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
    const item = await this.prisma.notificationSettings.create({ data: input });

    return new SettingsPaginatedResult([item], 1, 1, 1);
  }

  async createEmployeeProfilePermissions(
    input: CreateEmployeeProfilePermissionsInput
  ) {
    const item = await this.prisma.employeeProfilePermissions.create({
      data: input,
    });
    return new SettingsPaginatedResult([item], 1, 1, 1);
  }

  async createBusinessBankAccount(input: CreateBusinessBankAccountInput) {
    const item = await this.prisma.businessBankAccount.create({ data: input });
    return new SettingsPaginatedResult([item], 1, 1, 1);
  }

  async createPrincipalOfficer(input: CreatePrincipalOfficerInput) {
    const item = await this.prisma.principalOfficer.create({ data: input });
    return new SettingsPaginatedResult([item], 1, 1, 1);
  }

  async createPrintingOptions(input: CreatePrintingOptionsInput) {
    const item = await this.prisma.printingOptions.create({ data: input });
    return new SettingsPaginatedResult([item], 1, 1, 1);
  }

  async createDirectDepositOptions(input: CreateDirectDepositOptionsInput) {
    const item = await this.prisma.directDepositOptions.create({ data: input });
    return new SettingsPaginatedResult([item], 1, 1, 1);
  }

  async createContactInfo(input: CreateContactInfoInput) {
    const item = await this.prisma.contactInfo.create({ data: input });
    return new SettingsPaginatedResult([item], 1, 1, 1);
  }

  async update(
    id: number,
    notification?: UpdateNotificationSettingsInput,
    employeeProfile?: UpdateEmployeeProfilePermissionsInput,
    businessBank?: UpdateBusinessBankAccountInput,
    principalOfficer?: UpdatePrincipalOfficerInput,
    printing?: UpdatePrintingOptionsInput,
    directDeposit?: UpdateDirectDepositOptionsInput,
    contact?: UpdateContactInfoInput
  ): Promise<SettingsPaginatedResult> {
    await this.findOne(id);

    const updatePromises = [];

    if (notification) {
      updatePromises.push(
        this.prisma.notificationSettings.update({
          where: { id },
          data: notification,
        })
      );
    }
    if (employeeProfile) {
      updatePromises.push(
        this.prisma.employeeProfilePermissions.update({
          where: { id },
          data: employeeProfile,
        })
      );
    }
    if (businessBank) {
      updatePromises.push(
        this.prisma.businessBankAccount.update({
          where: { id },
          data: businessBank,
        })
      );
    }
    if (principalOfficer) {
      updatePromises.push(
        this.prisma.principalOfficer.update({
          where: { id },
          data: principalOfficer,
        })
      );
    }
    if (printing) {
      updatePromises.push(
        this.prisma.printingOptions.update({ where: { id }, data: printing })
      );
    }
    if (directDeposit) {
      updatePromises.push(
        this.prisma.directDepositOptions.update({
          where: { id },
          data: directDeposit,
        })
      );
    }
    if (contact) {
      updatePromises.push(
        this.prisma.contactInfo.update({ where: { id }, data: contact })
      );
    }

    const results = await Promise.all(updatePromises);

    return new SettingsPaginatedResult(results, 1, 1, results.length);
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

  async searchByProfileId(
    profileId: number,
    page = 1,
    limit = 10
  ): Promise<SettingsPaginatedResult> {
    const skip = (page - 1) * limit;

    const [
      notificationSettings,
      employeePermissions,
      businessAccounts,
      principalOfficers,
      printingOptions,
      directDeposits,
      contactInfos,
    ] = await Promise.all([
      this.prisma.notificationSettings.findMany({ where: { profileId } }),
      this.prisma.employeeProfilePermissions.findMany({ where: { profileId } }),
      this.prisma.businessBankAccount.findMany({ where: { profileId } }),
      this.prisma.principalOfficer.findMany({ where: { profileId } }),
      this.prisma.printingOptions.findMany({ where: { profileId } }),
      this.prisma.directDepositOptions.findMany({ where: { profileId } }),
      this.prisma.contactInfo.findMany({ where: { profileId } }),
    ]);

    const allItems: Array<
      | NotificationSettings
      | EmployeeProfilePermissions
      | BusinessBankAccount
      | PrincipalOfficer
      | PrintingOptions
      | DirectDepositOptions
      | ContactInfo
    > = [
      ...notificationSettings,
      ...employeePermissions,
      ...businessAccounts,
      ...principalOfficers,
      ...printingOptions,
      ...directDeposits,
      ...contactInfos,
    ];

    const totalCount = allItems.length;

    const paginatedItems = allItems.slice(skip, skip + limit);

    return new SettingsPaginatedResult(
      paginatedItems,
      Math.ceil(totalCount / limit),
      page,
      totalCount
    );
  }
}
