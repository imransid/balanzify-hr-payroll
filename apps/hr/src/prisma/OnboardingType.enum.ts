import { registerEnumType } from "@nestjs/graphql";

export enum OnboardingType {
  EMPLOYEE_SELF_ONBOARD_WITH_1_9 = "EMPLOYEE_SELF_ONBOARD_WITH_1_9",
  EMPLOYEE_SELF_ONBOARD = "EMPLOYEE_SELF_ONBOARD",
  ENTER_ALL_THEIR_INFO_MYSELF = "ENTER_ALL_THEIR_INFO_MYSELF",
}

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
