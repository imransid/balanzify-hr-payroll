import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class PayrollTaxCalculationService {
  private readonly STANDARD_DEDUCTION_SINGLE = 15000;
  private readonly STANDARD_DEDUCTION_MARRIED = 30000;
  private readonly STANDARD_DEDUCTION_HEAD = 22500;

  // 2025 Tax Brackets for Single Filers
  private readonly singleTaxBrackets = [
    { upTo: 11925, rate: 10 },
    { upTo: 48475, rate: 12 },
    { upTo: 103350, rate: 22 },
    { upTo: 197300, rate: 24 },
    { upTo: 250525, rate: 32 },
    { upTo: 626350, rate: 35 },
    { upTo: Infinity, rate: 37 },
  ];

  // 2025 Tax Brackets for Married Filing Jointly
  private readonly marriedTaxBrackets = [
    { upTo: 23850, rate: 10 },
    { upTo: 96950, rate: 12 },
    { upTo: 206700, rate: 22 },
    { upTo: 394600, rate: 24 },
    { upTo: 501050, rate: 32 },
    { upTo: 751600, rate: 35 },
    { upTo: Infinity, rate: 37 },
  ];

  // 2025 Tax Brackets for Head of Household
  private readonly headOfHouseholdTaxBrackets = [
    { upTo: 17000, rate: 10 },
    { upTo: 64850, rate: 12 },
    { upTo: 103350, rate: 22 },
    { upTo: 197300, rate: 24 },
    { upTo: 250500, rate: 32 },
    { upTo: 626350, rate: 35 },
    { upTo: Infinity, rate: 37 },
  ];

  private taxAmountCalculation(amount: number, rate: number): number {
    return amount * (rate / 100);
  }

  private deduction(amount: number, standardDeduction: number): number {
    return Math.max(amount - standardDeduction, 0);
  }

  private recursiveRateCalculation(
    taxableIncome: number,
    taxBrackets: { upTo: number; rate: number }[]
  ): number {
    let remainingIncome = taxableIncome;
    let totalTax = 0;
    let previousLimit = 0;

    for (const bracket of taxBrackets) {
      if (remainingIncome <= 0) {
        break;
      }

      const bracketAmount = Math.min(
        remainingIncome,
        bracket.upTo - previousLimit
      );
      totalTax += this.taxAmountCalculation(bracketAmount, bracket.rate);

      remainingIncome -= bracketAmount;
      previousLimit = bracket.upTo;
    }

    return totalTax;
  }

  // For Single Filers
  async createTaxRat(payrollTax: number) {
    const taxableIncome = this.deduction(
      payrollTax,
      this.STANDARD_DEDUCTION_SINGLE
    );

    if (taxableIncome <= 0) {
      return {
        taxableIncome,
        totalTax: 0,
        message: "No taxable income after standard deduction (Single filer).",
      };
    }

    const totalTax = this.recursiveRateCalculation(
      taxableIncome,
      this.singleTaxBrackets
    );

    return {
      taxableIncome,
      totalTax,
    };
  }

  // 🆕 For Married Filing Jointly
  async calculateMarriedTax(payrollTax: number) {
    const taxableIncome = this.deduction(
      payrollTax,
      this.STANDARD_DEDUCTION_MARRIED
    );

    if (taxableIncome <= 0) {
      return {
        taxableIncome,
        totalTax: 0,
        message: "No taxable income after standard deduction (Married filer).",
      };
    }

    const totalTax = this.recursiveRateCalculation(
      taxableIncome,
      this.marriedTaxBrackets
    );

    return {
      taxableIncome,
      totalTax,
    };
  }

  // 🆕 For Head of Household
  async calculateHeadOfHouseholdTax(payrollTax: number) {
    const taxableIncome = this.deduction(
      payrollTax,
      this.STANDARD_DEDUCTION_HEAD
    );

    if (taxableIncome <= 0) {
      return {
        taxableIncome,
        totalTax: 0,
        message:
          "No taxable income after standard deduction (Head of Household).",
      };
    }

    const totalTax = this.recursiveRateCalculation(
      taxableIncome,
      this.headOfHouseholdTaxBrackets
    );

    return {
      taxableIncome,
      totalTax,
    };
  }
}
