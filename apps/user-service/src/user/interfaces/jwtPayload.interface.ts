
import { UserType } from '../../prisma/user-type.enum';

export class JwtPayload {
    id: number;
    userType: keyof typeof  UserType;
  }