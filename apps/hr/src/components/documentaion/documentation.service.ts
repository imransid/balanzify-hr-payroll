import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service";
import {
  CreateDocumentationInput,
  UpdateDocumentationInput,
} from "../dto/documentation.input";
import { Documentation } from "../entities/documentation.entity";
import { DocumentationPaginatedResult } from "../dto/documentation.input"; // Adjust path if needed
import {
  deleteFileAndDirectory,
  uploadFileStream,
} from "utils/file-upload.util";
import { join } from "path";

@Injectable()
export class DocumentationService {
  constructor(private readonly prisma: PrismaHrService) {}

  private uploadDir = join(process.env.UPLOAD_DIR, `documentation`, "files");

  async create(
    createDocumentationInput: CreateDocumentationInput
  ): Promise<Documentation> {
    const imagePaths = createDocumentationInput?.documentationFile.map(
      async (image, index) => {
        const imageFile: any = await image;
        const fileName = `${Date.now()}_${index}_${imageFile.filename}`;
        const filePath = await uploadFileStream(
          imageFile.createReadStream,
          this.uploadDir,
          fileName
        );
        return filePath;
      }
    );
    const documentationFile = await Promise.all(imagePaths);

    delete createDocumentationInput.documentationFile;

    return this.prisma.documentation.create({
      data: {
        ...createDocumentationInput,
        documentationURL:
          documentationFile.length > 0 ? documentationFile[0] : "",
      },
    });
  }

  async findAll(
    page = 1,
    limit = 10,
    companyId: string
  ): Promise<DocumentationPaginatedResult> {
    const skip = (page - 1) * limit;

    const [documentations, totalCount] = await Promise.all([
      this.prisma.documentation.findMany({
        skip,
        take: limit,
        where: {
          companyId: companyId,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.documentation.count(),
    ]);

    return {
      documentations,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
    };
  }

  async findOne(id: number): Promise<Documentation> {
    const documentation = await this.prisma.documentation.findUnique({
      where: { id },
    });
    if (!documentation) {
      throw new NotFoundException(`Documentation with ID ${id} not found`);
    }
    return documentation;
  }

  async update(
    id: number,
    updateDocumentationInput: UpdateDocumentationInput
  ): Promise<Documentation> {
    let exitingData = await this.findOne(id); // Ensures it exists

    let uploadedImages: string[] = [];

    if (updateDocumentationInput.documentationFile?.length) {
      uploadedImages = await Promise.all(
        updateDocumentationInput.documentationFile?.map(
          async (image, index) => {
            const imageFile: any = await image;
            const fileName = `${Date.now()}_${index}_${imageFile.filename}`;
            return await uploadFileStream(
              imageFile.createReadStream,
              this.uploadDir,
              fileName
            );
          }
        )
      );
    }

    if (uploadedImages.length > 0) {
      if (
        uploadedImages.length > 0 &&
        exitingData.documentationURL.length > 0
      ) {
        const prevFilePath = exitingData.documentationURL.replace(
          `${process.env.BASE_URL}/`,
          ""
        );
        deleteFileAndDirectory(prevFilePath);
      }
    }

    delete updateDocumentationInput.documentationFile;

    return this.prisma.documentation.update({
      where: { id },
      data: {
        ...updateDocumentationInput,
        documentationURL:
          uploadedImages.length > 0
            ? uploadedImages[0]
            : exitingData.documentationURL,
      },
    });
  }

  async remove(id: number): Promise<Documentation> {
    await this.findOne(id); // Ensures it exists
    return this.prisma.documentation.delete({
      where: { id },
    });
  }

  async search(
    query: string,
    companyId: string,
    page = 1,
    limit = 10
  ): Promise<DocumentationPaginatedResult> {
    try {
      const skip = (page - 1) * limit;

      const whereClause: any = {
        companyId: companyId,
      };

      if (query) {
        whereClause.OR = [
          {
            documentationName: {
              contains: query,
              mode: "insensitive",
            },
          },
        ];
      }

      const [documentations, totalCount] = await Promise.all([
        this.prisma.documentation.findMany({
          where: whereClause,

          skip,
          take: limit,
        }),
        this.prisma.documentation.count({
          where: whereClause,
        }),
      ]);

      return {
        documentations,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error("🔴 Prisma Search Error:", error); // Add detailed logging
      throw new Error("Failed to search profiles");
    }
  }
}
