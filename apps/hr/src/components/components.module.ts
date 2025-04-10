import { Module } from "@nestjs/common";
import { PrismaModule } from "../../../../prisma/prisma.module";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { HolidayResolver } from "./holiday/hoiday.resolver";
import { HolidayService } from "./holiday/holiday.service";
import { DesignationResolver } from "./designation/designation.resolver";
import { DesignationService } from "./designation/designation.service";
import { LeaveResolver } from "./leave/leave.resolver";
import { LeaveService } from "./leave/leave.service";
import { DeductionContributionResolver } from "./deductionContribution/deductionContribution.resolver";
import { DeductionContributionService } from "./deductionContribution/deductionContribution.service";
import { LeaveTypeResolver } from "../components/leaveType/leaveType.resolver";
import { LeaveTypeService } from "../components/leaveType/leaveType.service";
import { ProfileResolver } from "../components/profile/profile.resolver";
import { ProfileService } from "../components/profile/profile.service";

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: {
          expiresIn: 3600,
        },
      }),
    }),
  ],
  providers: [
    JwtService,
    ConfigService,
    HolidayResolver,
    HolidayService,
    DesignationResolver,
    DesignationService,
    LeaveResolver,
    LeaveService,
    DeductionContributionResolver,
    DeductionContributionService,
    LeaveTypeResolver,
    LeaveTypeService,
    ProfileResolver,
    ProfileService,
  ],
})
export class ComponentsModule {}
