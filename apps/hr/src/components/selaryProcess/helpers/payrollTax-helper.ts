import { NetPaySummary } from "../../entities/taxRate.entity";

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

export function netPayHelper(
  details: ProfileDetails,
  grossPay: number,
  paySchedule: any,
  hourly: number,
  workingHours: number
): NetPaySummary | any {
  return "";
}
