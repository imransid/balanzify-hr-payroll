import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service";
import * as excelToJson from "convert-excel-to-json";

import { CreatePunchDataInput } from "../dto/punchData.input";

import {
  deleteFileAndDirectory,
  uploadFileStream,
} from "utils/file-upload.util";
import path, { join } from "path";
import { TimeSheet } from "../entities/timesheet.entity";

import { TimeSheetService } from "../timesheet/timesheet.service";

@Injectable()
export class PunchDataService {
  constructor(
    private readonly prisma: PrismaHrService,
    private readonly timeSheetService: TimeSheetService
  ) {}

  private uploadDir = join(process.env.UPLOAD_DIR, "punch-data", "files");

  async create(
    createPunchDataInput: CreatePunchDataInput
  ): Promise<TimeSheet[]> {
    const uploadedPaths = await Promise.all(
      createPunchDataInput?.punchFile?.map(async (file, index) => {
        const punchFile: any = await file;
        const fileName = `${Date.now()}_${index}_${punchFile.filename}`;

        const uploadedPath = await uploadFileStream(
          punchFile.createReadStream,
          this.uploadDir,
          fileName
        );
        return uploadedPath; // absolute path to file
      })
    );

    const path = uploadedPaths[0]; // Only handling first file for now

    if (!path) {
      throw new Error("Uploaded file path is missing");
    }

    const excelData = excelToJson({
      sourceFile: path,
      header: { rows: 1 },
      columnToKey: {
        A: "employeeId", // Now column A maps to employeeId
        B: "remarks",
        C: "startTime",
        D: "endTime",
        E: "startProcessDate",
        F: "endProcessDate",
        G: "totalTime",
        H: "createdBy",
        I: "createdAt",
        J: "status",
        K: "updatedAt",
      },
    });

    const rows = excelData.Sheet1;

    const timeSheets: TimeSheet[] = rows.map((row) => ({
      employeeId: Number(row.employeeId),
      remarks: row.remarks,
      startTime: new Date(row.startTime),
      endTime: new Date(row.endTime),
      startProcessDate: new Date(row.startProcessDate),
      endProcessDate: new Date(row.endProcessDate),
      totalTime: row.totalTime,
      createdBy: Number(row.createdBy),
      createdAt: new Date(row.createdAt),
      status: row.status,
      updatedAt: new Date(row.updatedAt),
      companyId: createPunchDataInput.companyId, // Use companyId from input
    }));

    const res = await Promise.all(
      timeSheets.map(async (e) => {
        try {
          return await this.timeSheetService.create(e);
        } catch (err) {
          console.error("Failed to create TimeSheet:", e, err.message);
          return null;
        }
      })
    );

    return res.filter(Boolean); // Filter out failed entries
  }
}
