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

export function calculatePayrollFieldsHelper(
  details: ProfileDetails,
  timeSheet: any[]
): PayrollCalculationResult {
  let ratePerHour = parseFloat(details?.ratePerHour || "0");
  const frequency = (details?.payFrequency || "").toUpperCase();

  let workingDays = 5;

  switch (frequency) {
    case "WEEKLY":
      workingDays = 5;
      break;
    case "BIWEEKLY":
      workingDays = 10;
      break;
    case "MONTHLY":
      workingDays = 22;
      break;
    case "SEMIMONTHLY":
      workingDays = 11;
      break;
    default:
      workingDays = 5;
  }

  let totalWorkedMinutes = 0;

  for (const entry of timeSheet) {
    const totalWorked = entry.totalWorked; // e.g., "2h 30m"
    const match = totalWorked.match(/(?:(\d+)h)?\s*(?:(\d+)m)?/);

    if (match) {
      const hours = parseInt(match[1] || "0", 10);
      const minutes = parseInt(match[2] || "0", 10);
      totalWorkedMinutes += hours * 60 + minutes;
    }
  }

  const workingHours = +(totalWorkedMinutes / 60).toFixed(2);

  let salary = 0;
  let grossPay = 0;
  let overTime = 0;
  let bonus = 0;

  if (details.payType.toUpperCase() === "HOURLY") {
    salary =
      parseFloat(details.ratePerHour || "0") *
      parseFloat(details.hoursPerDay || "0") *
      parseFloat(details.dayForWeek || "0") *
      52;

    overTime = details.offerDate ? 0 : 0;
    bonus = details.bonus ? 0 : 0;
    grossPay = overTime + bonus + salary;
  } else if (details.payType.toUpperCase() === "MONTHLY") {
    const salaryInput = parseFloat(details.salary || "0");
    const hoursPerDay = parseFloat(details.hoursPerDay || "0");
    const daysPerWeek = parseFloat(details.dayForWeek || "0");

    const weeksPerMonth = 4;
    const monthsPerYear = 12;

    let salary = 0;
    let ratePerHour = 0;

    switch (details.payFrequency) {
      case "PER_WEEK":
        salary = salaryInput * weeksPerMonth * monthsPerYear;
        ratePerHour = salaryInput / (hoursPerDay * daysPerWeek);
        break;

      case "PER_MONTH":
        salary = salaryInput * monthsPerYear;
        ratePerHour = salaryInput / (hoursPerDay * daysPerWeek * weeksPerMonth);
        break;

      default: // Assume annual
        salary = salaryInput;
        ratePerHour =
          salaryInput /
          (hoursPerDay * daysPerWeek * weeksPerMonth * monthsPerYear);
        break;
    }

    overTime = details.offerDate ? 0 : 0;
    bonus = details.bonus ? 0 : 0;
    grossPay = overTime + bonus + salary;
  } else {
    salary = parseFloat(details.salary || "0");
  }

  const monthlySalary = salary;
  const workingDaysPerMonth = 22;
  const workingHoursPerDay = 8;

  const hourlySalary =
    monthlySalary / (workingDaysPerMonth * workingHoursPerDay * 12);

  return {
    rate: ratePerHour.toFixed(2),
    salary: salary.toFixed(2),
    OT: details?.overTime ? "Yes" : "No",
    doubleOT: details?.doubleOverTimePay ? "Yes" : "No",
    bonus: details?.bonus ? "Yes" : "No",
    workingHours,
    grossPay,
    currentProfileHourlySalary: hourlySalary,
  };
}
