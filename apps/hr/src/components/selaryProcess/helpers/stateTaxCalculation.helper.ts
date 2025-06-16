import { stateTaxBrackets } from "./state-tax-rates.helper";

export function calculateStateIncomeTax(
  grossIncome: number,
  maritalStatus: string,
  stateName: string
): number {
  const state = stateTaxBrackets[stateName];
  if (!state || !state.SIT) return 0;

  const brackets = state.SIT;
  let totalTax = 0;

  for (const bracket of brackets) {
    const start =
      maritalStatus === "Married" ? bracket.married : bracket.single;
    const end = bracket.max;

    if (grossIncome > start) {
      const taxable = Math.min(grossIncome, end) - start;
      totalTax += taxable * bracket.rate;
    } else {
      break;
    }
  }

  return totalTax;
}

export function calculateUnemploymentInsurance(
  grossIncome: number,
  stateName: string
): number {
  const state = stateTaxBrackets[stateName];
  if (!state || !state.UI) return 0;

  const { rateRange, wageBase } = state.UI;
  const taxBase = Math.min(grossIncome, wageBase);
  const avgRate = (rateRange[0] + rateRange[1]) / 2;

  return taxBase * avgRate;
}
