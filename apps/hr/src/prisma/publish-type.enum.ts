import { registerEnumType } from '@nestjs/graphql';

export enum Publish {
    YES = "YES",
    NO = "NO",
}


registerEnumType(Publish, { name: 'Publish', description: undefined })