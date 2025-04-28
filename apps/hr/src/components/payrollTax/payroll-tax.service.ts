import { Injectable } from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service";
import { taxTable2025 } from "./taxTable2025"; // Assume taxTable2025 is already defined
import { TaxRate } from "../entities/taxRate.entity";
import { PayrollTaxCalculationService } from "./payrollTaxCalculation.service";
import { Tax } from "../entities/payrollTax.entity";
import { FilingStatus } from "../../prisma/OnboardingType.enum";

@Injectable()
export class PayrollTaxService {
  constructor(
    private readonly prisma: PrismaHrService,
    private readonly payrollTaxCalculationService: PayrollTaxCalculationService
  ) {}

  // Social Security Tax
  private socialSecurityTax(salary: number, rate: number = 6.2): number {
    // Employee contribution 6.2%
    return salary * (rate / 100);
  }

  // Medicare Tax
  private medicareTax(salary: number, rate: number = 1.45): number {
    // Employee contribution 1.45%
    return salary * (rate / 100);
  }

  // Federal Tax (for Unemployment)
  private federalTax(
    amount: number,
    rate: number = 6,
    isFirstPay: boolean,
    creditReduction: boolean
  ): number {
    if (isFirstPay && creditReduction && amount <= 7000) {
      return amount * (0.6 / 100);
    }
    return amount * (rate / 100);
  }

  // Federal Tax Withholding Calculation based on Filing Status
  private async federalTaxWithHolding(
    employee: boolean,
    filingStatus: string,
    income: number
  ): Promise<Tax> {
    if (employee) {
      // Function to calculate tax based on tax bracket

      switch (filingStatus) {
        case "single":
          return await this.payrollTaxCalculationService.createTaxRat(income);
        case "married_filing_jointly":
          return await this.payrollTaxCalculationService.calculateMarriedTax(
            income
          );
        case "head_of_household":
          return await this.payrollTaxCalculationService.calculateHeadOfHouseholdTax(
            income
          );
      }
    } else {
      // Employer contribution logic (if required)
      // return 0;
    }
  }

  // Main method to calculate all tax components
  async taxRate(amount: number, filingStatus: FilingStatus): Promise<TaxRate> {
    // You need to calculate the tax amount based on filing status and income
    const taxAmount = this.federalTaxWithHolding(true, filingStatus, amount);
    const medicareTax = this.medicareTax(amount);
    const socialSecurityTax = this.socialSecurityTax(amount);

    // Return the calculated tax rates in the TaxRate entity
    return {
      federalTaxWithHolding: (await taxAmount).totalTax,
      taxableIncome: (await taxAmount).taxableIncome,
      medicareTax: medicareTax,
      socialSecurityTax: socialSecurityTax,
    };
  }
}
