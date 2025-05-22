import { Injectable } from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service";
import { taxTable2025 } from "./taxTable2025"; // Assume taxTable2025 is already defined
import { TaxRate, TaxRateEmployer } from "../entities/taxRate.entity";
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

  private additionalMedicareTax(
    salary: number,
    rate: number = 0.9,
    employeeStatus: boolean
  ) {
    // Additional
    if (employeeStatus) {
      // employee
      if (salary > 200000) {
        let employeeSalary = salary - 200000;
        return employeeSalary * (rate / 100);
      } else {
        return 0;
      }
    } else {
      // employer
      return 0;
    }
  }

  // Medicare Tax
  private medicareTax(salary: number, rate: number = 1.45): number {
    // Employee contribution 1.45%
    return salary * (rate / 100);
  }

  // FUTA(for Unemployment)
  private futaTax(
    amount: number,
    rate: number = 6,
    isFirstPay: boolean = false,
    creditReduction: boolean = false
  ): number {
    let fixedAmount = 7000;

    if (isFirstPay && creditReduction && amount <= 7000) {
      return fixedAmount * (0.6 / 100);
    }
    return amount <= 7000 ? fixedAmount * (rate / 100) : 0;
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

    const monthlyRate = (await taxAmount).totalTax / 12;
    const weeklyRate = (await taxAmount).totalTax / 52;
    const hourlyRate = (await taxAmount).totalTax / (5 * 8 * 52);

    // Return the calculated tax rates in the TaxRate entity
    return {
      federalTaxWithHoldingYearly: (await taxAmount).totalTax,
      taxableIncome: (await taxAmount).taxableIncome,
      medicareTax: medicareTax,
      socialSecurityTax: socialSecurityTax,
      federalTaxWithHoldingMonthlyRate: monthlyRate,
      federalTaxWithHoldingWeeklyRate: weeklyRate,
      federalTaxWithHoldingHourlyRate: hourlyRate,
    };
  }

  // Main method to calculate all tax components
  async taxRateEmployee(amount: number): Promise<TaxRate> {
    // You need to calculate the tax amount based on filing status and income
    const taxAmount = 12;
    //this.federalTaxWithHolding(true, filingStatus, amount);
    const medicareTax = this.medicareTax(amount);
    const socialSecurityTax = this.socialSecurityTax(amount);

    const monthlyRate = 122; //(await taxAmount).totalTax / 12;
    const weeklyRate = 12; //(await taxAmount).totalTax / 52;

    const additionalMedicareTax = this.additionalMedicareTax(amount, 0.9, true);

    const hourlyRate = 0; //(await taxAmount).totalTax / (5 * 8 * 52);

    // Return the calculated tax rates in the TaxRate entity
    return {
      federalTaxWithHoldingYearly: 12, //(await taxAmount).totalTax,
      taxableIncome: 12, //(await taxAmount).taxableIncome,
      medicareTax: medicareTax,
      socialSecurityTax: socialSecurityTax,
      federalTaxWithHoldingMonthlyRate: monthlyRate,
      federalTaxWithHoldingWeeklyRate: weeklyRate,
      federalTaxWithHoldingHourlyRate: hourlyRate,
    };
  }

  async taxRateEmployer(amount: number): Promise<TaxRateEmployer> {
    // You need to calculate the tax amount based on filing status and income

    //this.federalTaxWithHolding(true, filingStatus, amount);
    const medicareTax = this.medicareTax(amount);
    const socialSecurityTax = this.socialSecurityTax(amount);

    const additionalMedicareTax = this.additionalMedicareTax(amount, 0.9, true);
    const futaTax = this.futaTax(amount);

    // Return the calculated tax rates in the TaxRate entity
    return {
      medicareTax: medicareTax,
      socialSecurityTax: socialSecurityTax,
      additionalMedicareTax: additionalMedicareTax,
      futaTax: futaTax,
    };
  }
}
