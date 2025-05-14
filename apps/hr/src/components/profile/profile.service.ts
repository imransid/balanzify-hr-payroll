import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service"; // Make sure this path is correct
import {
  CreateProfileInput,
  ProfilePaginatedResult,
  UpdateProfileInput,
} from "../dto/profile.input"; // Make sure these paths are correct

import { MailerService } from "@nestjs-modules/mailer";
import { sendMail } from "../../../../../utils/email.util";
import { OnboardingType } from "../../prisma/OnboardingType.enum";
import { Profile } from "../entities/profile.entity";

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaHrService,
    private readonly mailService: MailerService
  ) {}

  async create(createProfileInput: CreateProfileInput): Promise<Profile> {
    let profile: Profile;

    try {
      // Create the profile in the database
      profile = await this.prisma.profile.create({
        data: {
          email: createProfileInput.email,
          employeeName: createProfileInput.employeeName,
          middleName: createProfileInput.middleName,
          lastName: createProfileInput.lastName,
          hireDate: createProfileInput.hireDate,
          designation: createProfileInput.designation,
          status: createProfileInput.status,
          onboardingType: createProfileInput.onboardingType, // Use enum here
          department: createProfileInput.department || null,
          companyID: createProfileInput.companyID || null,
          employeeType: createProfileInput.employeeType || null,
          mobilePhone: createProfileInput.mobilePhone || null,
        },
      });

      // Only send the email if onboardingType matches
      if (
        createProfileInput.onboardingType === "EMPLOYEE_SELF_ONBOARD" ||
        createProfileInput.onboardingType === "EMPLOYEE_SELF_ONBOARD_WITH_1_9"
      ) {
        // Prepare email content
        const { employeeName, designation, hireDate } = createProfileInput;
        const firstName = employeeName.split(" ")[0]; // Extract first name
        const subject = `Welcome to the ${createProfileInput.companyName} - Onboarding Instructions`;

        const body = `
  <h1 style="font-size: 24px; color: #333;">Welcome ${firstName}!</h1>
  <p>We are excited to have you join the team as a <strong>${designation}</strong>.</p>
  <p>Your official start date is <strong>${hireDate.toISOString().split("T")[0]}</strong>.</p>
  <p>Please complete your onboarding by visiting the following link:</p>
  <a href="https://blanzify.vercel.app/dashboard/hris/employee/employee_list/add_employee_info?eid=${profile.id}&obt=i9" 
     style="color: blue; text-decoration: underline;">
    Complete Onboarding
  </a>
`;
        sendMail(createProfileInput.email, subject, body, this.mailService);
      }

      return profile;
    } catch (error) {
      // Handle profile creation error
      console.error("Error during profile creation:", error);
      throw new InternalServerErrorException("Failed to create profile");
    }
  }

  async findAll(page = 1, limit = 10): Promise<ProfilePaginatedResult> {
    const skip = (page - 1) * limit;

    const [profiles, totalCount] = await Promise.all([
      this.prisma.profile.findMany({
        skip,
        take: limit,
        include: {
          profileDetails: {
            include: {
              shift: true,
              paySchedule: true,
              holidayDetails: true,
            },
          },
        },
      }) || [],
      this.prisma.profile.count(),
    ]);

    return {
      profiles: Array.isArray(profiles) ? profiles : [],
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
    };
  }

  async findOne(id: number, employeeID: string): Promise<Profile> {
    if (!id && !employeeID) throw new Error("Supply either id or employeeID");

    const where = id ? { id } : { employeeID };

    const profile = await this.prisma.profile.findUnique({
      where,
      include: {
        timeSheet: true,
        profileDetails: {
          include: {
            shift: true,
            paySchedule: true,
            holidayDetails: true,
          },
        },
      },
    });
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    return profile;
  }

  async update(
    id: number,
    updateProfileInput: UpdateProfileInput
  ): Promise<Profile> {
    await this.findOne(id, ""); // Ensure it exists
    return this.prisma.profile.update({
      where: { id },
      data: updateProfileInput,
    });
  }

  async remove(id: number): Promise<Profile> {
    await this.findOne(id, ""); // Ensure it exists
    return this.prisma.profile.delete({
      where: { id },
    });
  }

  async search(
    query: string,
    page = 1,
    limit = 10
  ): Promise<ProfilePaginatedResult> {
    const skip = (page - 1) * limit;

    const [profiles, totalCount] = await Promise.all([
      this.prisma.profile.findMany({
        where: {
          OR: [
            {
              employeeName: { contains: query, mode: "insensitive" },
            },
            {
              email: { contains: query, mode: "insensitive" },
            },
          ],
        },
        include: {
          profileDetails: true,
        },
        skip,
        take: limit,
      }),
      this.prisma.profile.count({
        where: {
          OR: [
            {
              employeeName: { contains: query, mode: "insensitive" },
            },
            {
              email: { contains: query, mode: "insensitive" },
            },
          ],
        },
      }),
    ]);

    return {
      profiles,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }
}
