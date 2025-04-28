import { registerEnumType } from "@nestjs/graphql";

export enum OnboardingType {
  EMPLOYEE_SELF_ONBOARD_WITH_1_9 = "EMPLOYEE_SELF_ONBOARD_WITH_1_9",
  EMPLOYEE_SELF_ONBOARD = "EMPLOYEE_SELF_ONBOARD",
  ENTER_ALL_THEIR_INFO_MYSELF = "ENTER_ALL_THEIR_INFO_MYSELF",
}

export enum FrequencyType {
  EVERY_WEEK = "EVERY_WEEK",
  EVERY_ONCE_WEEK = "EVERY_ONCE_WEEK",
  TWICE_A_MONTH = "TWICE_A_MONTH",
  EVERY_MONTH = "EVERY_MONTH",
}

registerEnumType(FrequencyType, {
  name: "FrequencyType", // The name of the enum in GraphQL
  description: "Different types of FrequencyType", // Optional description
});

registerEnumType(OnboardingType, {
  name: "OnboardingType", // The name of the enum in GraphQL
  description: "Different types of onboarding for employees", // Optional description
});

export enum StatusType {
  ACTIVE = "ACTIVE",
  DE_ACTIVE = "DE_ACTIVE",
}

registerEnumType(StatusType, {
  name: "StatusType", // The name of the enum in GraphQL
  description: "Different Status Type", // Optional description
});

export enum FilingStatus {
  SINGLE = "single",
  MARRIED = "married_filing_jointly",
  HEAD_OF_HOUSEHOLD = "head_of_household",
}

registerEnumType(FilingStatus, {
  name: "FilingStatus", // This name will appear in GraphQL Schema
  description: "The filing status of the taxpayer",
});
