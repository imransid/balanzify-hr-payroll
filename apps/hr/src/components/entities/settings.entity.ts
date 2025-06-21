// ✅ settings.entity.ts — All Entities in One File

import { ObjectType, Field, Int, createUnionType } from "@nestjs/graphql";

@ObjectType()
export class NotificationSettings {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  clientPaydayEmails?: boolean;

  @Field({ nullable: true })
  paydayReminders?: boolean;

  @Field({ nullable: true })
  reminderType?: string;

  @Field({ nullable: true })
  taxSetupReminders?: boolean;

  @Field({ nullable: true })
  companyId?: string;

  @Field(() => Int, { nullable: true })
  profileId?: number;
}

@ObjectType()
export class EmployeeProfilePermissions {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  personalInfo?: boolean;

  @Field({ nullable: true })
  taxWithholdings?: boolean;

  @Field({ nullable: true })
  directDepositEdit?: boolean;

  @Field({ nullable: true })
  companyId?: string;

  @Field(() => Int, { nullable: true })
  profileId?: number;
}

@ObjectType()
export class BusinessBankAccount {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  legalName?: string;
  @Field({ nullable: true })
  businessEmail?: string;
  @Field({ nullable: true })
  website?: string;
  @Field({ nullable: true })
  industry?: string;
  @Field({ nullable: true })
  businessType?: string;
  @Field({ nullable: true })
  businessPhone?: string;
  @Field({ nullable: true })
  businessAddress?: string;
  @Field({ nullable: true })
  businessApt?: string;
  @Field({ nullable: true })
  businessZip?: string;
  @Field({ nullable: true })
  businessCity?: string;
  @Field({ nullable: true })
  businessState?: string;

  @Field({ nullable: true })
  companyId?: string;

  @Field(() => Int, { nullable: true })
  profileId?: number;
}

@ObjectType()
export class PrincipalOfficer {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  ownerTitle?: string;
  @Field({ nullable: true })
  ownerFirstName?: string;
  @Field({ nullable: true })
  ownerLastName?: string;
  @Field({ nullable: true })
  mobileNumber?: string;
  @Field({ nullable: true })
  sameAsBusinessPhone?: boolean;
  @Field({ nullable: true })
  ssnLast4?: string;
  @Field({ nullable: true })
  dateOfBirth?: string;
  @Field({ nullable: true })
  personalAddress?: string;
  @Field({ nullable: true })
  personalApt?: string;
  @Field({ nullable: true })
  personalZip?: string;
  @Field({ nullable: true })
  sameAsBusinessAddress?: boolean;

  @Field({ nullable: true })
  companyId?: string;

  @Field(() => Int, { nullable: true })
  profileId?: number;
}

@ObjectType()
export class PrintingOptions {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  payStubsOnly?: boolean;
  @Field({ nullable: true })
  payChecksAndStubs?: boolean;

  @Field({ nullable: true })
  companyId?: string;

  @Field(() => Int, { nullable: true })
  profileId?: number;
}

@ObjectType()
export class DirectDepositOptions {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  sameDay?: boolean;
  @Field({ nullable: true })
  fiveDay?: boolean;

  @Field({ nullable: true })
  companyId?: string;

  @Field(() => Int, { nullable: true })
  profileId?: number;
}

@ObjectType()
export class ContactInfo {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  firstName?: string;
  @Field({ nullable: true })
  lastName?: string;
  @Field({ nullable: true })
  businessPhone?: string;
  @Field({ nullable: true })
  emailAddress?: string;

  @Field({ nullable: true })
  companyId?: string;

  @Field(() => Int, { nullable: true })
  profileId?: number;
}

// 1️⃣ Union Type of All Setting Entities
const SettingsUnion = createUnionType({
  name: "SettingsUnion",
  types: () => [
    NotificationSettings,
    EmployeeProfilePermissions,
    BusinessBankAccount,
    PrincipalOfficer,
    PrintingOptions,
    DirectDepositOptions,
    ContactInfo,
  ],
  resolveType(value) {
    if ("clientPaydayEmails" in value) return NotificationSettings;
    if ("personalInfo" in value) return EmployeeProfilePermissions;
    if ("legalName" in value) return BusinessBankAccount;
    if ("ownerTitle" in value) return PrincipalOfficer;
    if ("payStubsOnly" in value) return PrintingOptions;
    if ("sameDay" in value) return DirectDepositOptions;
    if ("emailAddress" in value) return ContactInfo;
    return null;
  },
});

// 2️⃣ Unified Paginated Result
@ObjectType()
export class SettingsPaginatedResult {
  @Field(() => [SettingsUnion], { defaultValue: [] })
  items: Array<
    | NotificationSettings
    | EmployeeProfilePermissions
    | BusinessBankAccount
    | PrincipalOfficer
    | PrintingOptions
    | DirectDepositOptions
    | ContactInfo
  >;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalCount: number;

  constructor(
    items: Array<
      | NotificationSettings
      | EmployeeProfilePermissions
      | BusinessBankAccount
      | PrincipalOfficer
      | PrintingOptions
      | DirectDepositOptions
      | ContactInfo
    >,
    totalPages: number,
    currentPage: number,
    totalCount: number
  ) {
    this.items = items ?? [];
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.totalCount = totalCount;
  }
}
