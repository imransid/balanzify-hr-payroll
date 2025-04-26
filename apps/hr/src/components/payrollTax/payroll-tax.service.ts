import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service";
import { taxTable2025 } from "./taxTable2025"; // Assume taxTable2025 is already defined
import { TaxRate } from "../entities/taxRate.entity";

@Injectable()
export class PayrollTaxService {
  constructor(private readonly prisma: PrismaHrService) {}

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
  private federalTaxWithHolding(
    employee: boolean,
    filingStatus: string,
    income: number
  ): number {
    if (employee) {
      // Function to calculate tax based on tax bracket
      const calculateTax = (
        bracketTable: Array<{ range: number[]; tax: number }>,
        income: number
      ) => {
        for (let i = 0; i < bracketTable.length; i++) {
          const bracket = bracketTable[i];
          // Check if income falls within the range
          if (income >= bracket.range[0] && income <= bracket.range[1]) {
            return bracket.tax;
          }
        }
        return 0; // Default return if no match
      };

      switch (filingStatus) {
        case "single":
          return calculateTax(taxTable2025.single, income);
        case "married_filing_jointly":
          return calculateTax(taxTable2025.married_filing_jointly, income);
        case "married_filing_separately":
          return calculateTax(taxTable2025.married_filing_separately, income);
        case "head_of_household":
          return calculateTax(taxTable2025.head_of_household, income);
        case "qualifying_window":
          return calculateTax(taxTable2025.married_filing_jointly, income); // Assumed same as married filing jointly for now
        default:
          return 0; // Default return if no match for filing status
      }
    } else {
      // Employer contribution logic (if required)
      return 0;
    }
  }

  // Main method to calculate all tax components
  async taxRate(amount: number): Promise<TaxRate> {
    // You need to calculate the tax amount based on filing status and income
    const filingStatus = "married_filing_jointly"; // Assuming this is dynamically passed in practice
    const taxAmount = this.federalTaxWithHolding(true, filingStatus, amount);
    const medicareTax = this.medicareTax(amount);
    const socialSecurityTax = this.socialSecurityTax(amount);

    // Return the calculated tax rates in the TaxRate entity
    return {
      federalTaxWithHolding: taxAmount,
      medicareTax: medicareTax,
      socialSecurityTax: socialSecurityTax,
    };
  }
}
