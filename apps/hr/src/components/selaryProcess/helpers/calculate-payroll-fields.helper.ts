interface ProfileDetails {
  ratePerHour?: string;
  payFrequency?: string;
  payType: string;
  hoursPerDay?: string;
  dayForWeek?: string;
  salary?: string;
  bonus?: boolean;
  offerDate?: string;
  overTime?: boolean;
  doubleOverTimePay?: boolean;
}

interface PayrollCalculationResult {
  rate: string;
  salary: string;
  OT: string;
  doubleOT: string;
  bonus: string;
  workingHours: number;
  grossPay: number;
  currentProfileHourlySalary: number;
}

// Helper to convert time format like "2h 30m" to total minutes
function parseWorkedMinutes(time: string): number {
  const match = time.match(/(?:(\d+)h)?\s*(?:(\d+)m)?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  return hours * 60 + minutes;
}

// Helper to compute rate per hour from monthly/weekly/annual salary
function computeHourlyRate(
  salary: number,
  hoursPerDay: number,
  daysPerWeek: number,
  frequency: string
): number {
  const weeksPerMonth = 4;
  const monthsPerYear = 12;

  switch (frequency?.toUpperCase()) {
    case "PER_WEEK":
      return salary / (hoursPerDay * daysPerWeek);
    case "PER_MONTH":
      return salary / (hoursPerDay * daysPerWeek * weeksPerMonth);
    default: // Assume annual
      return salary / (hoursPerDay * daysPerWeek * 52);
  }
}

export function calculatePayrollFieldsHelper(
  details: ProfileDetails,
  timeSheet: any[],
  paySchedule: any
): PayrollCalculationResult {
  const payType = details.payType.toUpperCase();
  let ratePerHour = parseFloat(details.ratePerHour || "0");
  const salaryInput = parseFloat(details.salary || "0");
  const hoursPerDay = parseFloat(details.hoursPerDay || "8");
  const daysPerWeek = parseFloat(details.dayForWeek || "5");
  const frequency = (details?.payFrequency || "").toUpperCase();

  // 1. Calculate total worked minutes
  const totalWorkedMinutes = timeSheet.reduce((acc, entry) => {
    return acc + parseWorkedMinutes(entry.totalWorked);
  }, 0);

  let workingHours = +(totalWorkedMinutes / 60).toFixed(2);

  let salary = 0;
  let grossPay = 0;
  let overTime = 0;
  let bonus = 0;

  // 2. Calculate salary and hourly rate
  if (payType === "HOURLY") {
    salary = ratePerHour * (totalWorkedMinutes / 60);
  } else if (payType === "MONTHLY") {
    ratePerHour = computeHourlyRate(
      salaryInput,
      hoursPerDay,
      daysPerWeek,
      frequency
    );

    const hoursPerWeek = hoursPerDay * daysPerWeek;

    switch (paySchedule?.payFrequency) {
      case "EVERY_WEEK":
      case "EVERY_ONCE_WEEK":
        salary = ratePerHour * hoursPerWeek;
        workingHours = 40;
        break;
      case "TWICE_A_MONTH":
        salary = ratePerHour * hoursPerWeek * 2;
        workingHours = 40 * 2;
        break;
      default:
        salary = ratePerHour * hoursPerWeek * 4;
        workingHours = 40 * 4;
        break;
    }
  } else {
    // For fixed salary regardless of type
    salary = salaryInput;
  }

  // 3. Add bonus and OT if applicable
  overTime = details.overTime ? 0 : 0;
  bonus = details.bonus ? 0 : 0;
  grossPay = salary + bonus + overTime;

  // 4. Hourly salary for current profile (assumed yearly)
  const monthlySalary = salary;
  const workingDaysPerMonth = 22;
  const workingHoursPerDay = 8;
  const currentHourlySalary = +(
    monthlySalary /
    (workingDaysPerMonth * workingHoursPerDay * 12)
  ).toFixed(2);

  return {
    rate: ratePerHour.toFixed(2),
    salary: salary.toFixed(2),
    OT: details?.overTime ? "0" : "0",
    doubleOT: details?.doubleOverTimePay ? "0" : "0",
    bonus: details?.bonus ? "0" : "0",
    workingHours,
    grossPay,
    currentProfileHourlySalary: currentHourlySalary,
  };
}
