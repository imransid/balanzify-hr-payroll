import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service";
import * as excelToJson from "convert-excel-to-json";

import {
  CreatePunchDataInput,
  //   UpdatePunchDataInput,
} from "../dto/punchData.input";

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

  async create(createPunchDataInput: CreatePunchDataInput): Promise<TimeSheet> {
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
        A: "id",
        B: "employeeId",
        C: "remarks",
        D: "startTime",
        E: "endTime",
        F: "startProcessDate",
        G: "endProcessDate",
        H: "totalTime",
        I: "createdBy",
        J: "createdAt",
        K: "status",
        L: "updatedAt",
      },
    });

    return await this.timeSheetService.create(excelData);
  }
}
