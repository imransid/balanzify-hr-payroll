import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Insert into Designation
  const designation = await prisma.designation.create({
    data: {
      designationName: "Software Engineer",
      designation: "SE",
    },
  });

  // Insert into Leave
  const leave = await prisma.leave.create({
    data: {
      leaveName: "Annual Leave",
      displayName: "Annual",
      definition: "Vacation leave",
      color: "#FFA500",
      leaveType: "Paid",
      maxLeaveAllocation: 15,
      status: true,
    },
  });

  // Insert into Profile
  const profile = await prisma.profile.create({
    data: {
      email: "john.doe@example.com",
      employeeName: "John",
      middleName: "A",
      lastName: "Doe",
      hireDate: new Date(),
      designation: designation.designation,
      department: "Engineering",
      paySchedule: "Monthly",
      employeeType: "Full-time",
      mobilePhone: "0123456789",
      status: true,
      onboardingType: "EMPLOYEE_SELF_ONBOARD_WITH_1_9",
    },
  });

  // Insert into ProfileDetails
  await prisma.profileDetails.create({
    data: {
      displayName: "John D.",
      profileId: profile.id,
    },
  });

  // Insert into Holiday
  const holiday = await prisma.holiday.create({
    data: {
      name: "Eid Vacation",
      fromDate: new Date("2025-04-10"),
      toDate: new Date("2025-04-12"),
      country: "Bangladesh",
      weekend: "Friday-Saturday",
      totalHoliday: "3",
      status: true,
      color: "#00FF00",
    },
  });

  // Insert into HolidayDetails
  await prisma.holidayDetails.create({
    data: {
      No: 1,
      Date: new Date("2025-04-10"),
      Type: "Public",
      Description: "Eid Day 1",
      holidayId: holiday.id,
    },
  });

  // Insert into Shift
  await prisma.shift.create({
    data: {
      shiftName: "Day Shift",
      shiftCode: "DS",
      shiftDescription: "Regular daytime shift",
      shiftType: "Fixed",
      regularHour: "8",
      shiftLate: "15",
      shiftIn: "09:00",
      shiftOut: "17:00",
      lunchTime: "1",
      lunchIn: "13:00",
      lunchOut: "14:00",
      tiffinTime: "0",
      tiffinIn: "",
      tiffinOut: "",
    },
  });

  console.log("✅ Sample data inserted for all tables!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
