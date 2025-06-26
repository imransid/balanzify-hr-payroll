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
import moment from "moment";

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
          employeeID: createProfileInput.employeeID || null,
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
        // sendMail(createProfileInput.email, subject, body, this.mailService);
      }

      return profile;
    } catch (error) {
      // Handle profile creation error
      console.error("Error during profile creation:", error);
      throw new InternalServerErrorException("Failed to create profile");
    }
  }

  async findAll(
    page = 1,
    limit = 10,
    companyID: string
  ): Promise<ProfilePaginatedResult> {
    const skip = (page - 1) * limit;

    const [profiles, totalCount] = await Promise.all([
      this.prisma.profile.findMany({
        skip,
        take: limit,
        where: {
          companyID: companyID,
        },
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

      this.prisma.profile.count({
        where: { companyID },
      }),
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

    const profile: Profile = await this.prisma.profile.findUnique({
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
            {
              companyID: { contains: query, mode: "insensitive" },
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

  formatDate(date) {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  getTimeSheetDateRangeString(timeSheet) {
    if (!timeSheet.length) return "No entries";

    const startDates = timeSheet.map((entry) => new Date(entry.startTime));
    const minDate = new Date(Math.min(...startDates));
    const maxDate = new Date(Math.max(...startDates));

    const formattedStart = this.formatDate(minDate); // e.g. "01 July 2024"
    const formattedEnd = this.formatDate(maxDate); // e.g. "28 July 2024"

    // Remove year from start if same year
    const startMonth = minDate.toLocaleDateString("en-GB", { month: "long" });
    const endYear = maxDate.getFullYear();
    const startDay = String(minDate.getDate()).padStart(2, "0");

    return `${startDay} ${startMonth} to ${formattedEnd}`;
  }

  async gettingJobCard(employeeID: string, profileId: number) {
    try {
      // Validate input
      if (!employeeID && !profileId) {
        throw new Error("At least profileId or employeeID must be provided.");
      }

      // Build query conditions
      const conditions = [
        ...(employeeID ? [{ employeeID }] : []),
        ...(profileId ? [{ id: profileId }] : []),
      ];

      // Fetch profile with related data
      const profile = await this.prisma.profile.findFirst({
        where: { OR: conditions },
        include: {
          profileDetails: {
            include: {
              shift: true,
            },
          },
          timeSheet: true,
        },
      });

      if (!profile || !profile.profileDetails) {
        throw new Error("Profile or profile details not found.");
      }

      const { timeSheet, profileDetails } = profile;
      const { shift } = profileDetails;

      let lateDays = 0;
      let earlyOutCount = 0;

      function getTimeInMinutes(dateTime) {
        const date = new Date(dateTime);
        return date.getUTCHours() * 60 + date.getUTCMinutes();
      }

      if (shift && shift.shiftIn && shift.shiftOut && timeSheet.length > 0) {
        const shiftInMinutes = getTimeInMinutes(shift.shiftIn);
        const shiftOutMinutes = getTimeInMinutes(shift.shiftOut);

        timeSheet.forEach((entry) => {
          const startMinutes = getTimeInMinutes(entry.startTime);
          const endMinutes = getTimeInMinutes(entry.endTime);

          if (startMinutes > shiftInMinutes) {
            lateDays++;
          }

          if (endMinutes < shiftOutMinutes) {
            earlyOutCount++;
          }
        });
      }

      const dateRangeStr = this.getTimeSheetDateRangeString(timeSheet);

      const jobCardReport = {
        employeeName: profile.employeeName ?? "N/A",
        roleName: profileDetails.role ?? "N/A",
        employeeId: profile.employeeID,
        designation: profile.designation ?? "N/A",
        department: profile.department ?? "N/A",
        officeLocation: profileDetails.company ?? "N/A",
        joinDate: profileDetails.dateOfJoining ?? "N/A",
        releaseDate: "N/A",
        presentDays: timeSheet.length,
        earlyOutCount,
        lateDays,
        absentDays: 0,
        leaveDays: 0,
        timeDifference: "0 hr 0 Min",
        approvedOT: "0 hr 0 Min",
        dateRange: dateRangeStr,
        profileImageUrl: profileDetails.photo ?? "default.png",
        timeSheet: timeSheet,
      };

      return {
        success: true,
        message: "Job card report fetched successfully.",
        data: jobCardReport,
      };
    } catch (error) {
      // Log error for debugging
      console.error("Error in gettingJobCard:", error);

      // Throw or return error with meaningful message
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Unknown error occurred.",
        data: null,
      };
    }
  }
}
