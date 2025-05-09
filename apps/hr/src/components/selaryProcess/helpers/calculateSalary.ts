import * as moment from "moment";

export function calculateOvertimeHours() {
  const currentYear = moment().year();
  const startOfYear = moment().startOf("year");
  const endOfYear = moment().endOf("year");

  let totalWorkingDays = 0;
  let workingDaysPerMonth: Record<number, number> = {};

  let day = startOfYear.clone();
  while (day.isSameOrBefore(endOfYear)) {
    const dayOfWeek = day.day(); // 0 = Sun, 6 = Sat
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      totalWorkingDays++;
      const month = day.month(); // 0 = Jan, 11 = Dec
      workingDaysPerMonth[month] = (workingDaysPerMonth[month] || 0) + 1;
    }
    day.add(1, "day");
  }

  const dailyHour = 8;
  const weekLyWorkHour = 40;
  const totalWorkingHours = totalWorkingDays * dailyHour;

  const monthCount = Object.keys(workingDaysPerMonth).length;
  const monthLyWorkHour = Math.round(totalWorkingHours / monthCount);
  const twiceMonthWorkHour = Math.round(monthLyWorkHour / 2);
  const yearlyWorkHour = totalWorkingHours;

  return {
    monthLyWorkHour,
    weekLyWorkHour,
    twiceMonthWorkHour,
    yearlyWorkHour,
  };
}
