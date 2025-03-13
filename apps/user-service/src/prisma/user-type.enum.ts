import { registerEnumType } from '@nestjs/graphql';

export enum UserType {
    SUPERADMIN = "SUPERADMIN",
    OTHER = "OTHER",
}


registerEnumType(UserType, { name: 'UserType', description: undefined })