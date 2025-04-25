import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service";

@Injectable()
export class PayrollTaxService {
  constructor(private readonly prisma: PrismaHrService) {}

  //   social security tax

  private socialSecurityTax(salary: number, rate: number = 6.2): number {
    // employee contribution 6.2%

    return salary * (rate / 100);
  }

  private medicareTax(salary: number, rate: number = 1.45): number {
    // employee contribution 1.45%

    return salary * (rate / 100);
  }

  //     for owner Federal UNemp TAx

  private FederalTax(){
    
  }
}
