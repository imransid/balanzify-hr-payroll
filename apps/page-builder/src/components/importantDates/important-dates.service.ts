import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaPageBuilderService } from '../../../../../prisma/prisma-page-builder.service';
import { CreateImportantDatesInput } from '../dto/create-important-dates.input';
import { UpdateImportantDatesInput } from '../dto/update-important-dates.input';
import * as path from 'path';
import { ImportantDates } from '../entities/important.dates.entity';
import { uploadFileStream } from 'utils/file-upload.util';
import { formatISO } from 'date-fns';

@Injectable()
export class ImportantDatesService {
  private logger = new Logger('ImportantDatesService');

  private uploadDir = path.join(process.env.UPLOAD_DIR, `notice`, 'files');

  constructor(
    @Inject(PrismaPageBuilderService)
    private prismaService: PrismaPageBuilderService,
  ) {}

  /**
   * Create a new important date entry
   */
  async create(
    createImportantDatesInput: CreateImportantDatesInput,
    userId: string,
  ): Promise<ImportantDates> {
    // Handle file upload
    const imageFile: any = await createImportantDatesInput.attachmentFile;
    const fileName = `${Date.now()}_${imageFile.filename}`;
    const filePath = await uploadFileStream(
      imageFile.createReadStream,
      this.uploadDir,
      fileName,
    );

    const formattedDate = formatISO(new Date(createImportantDatesInput.date));

    const newImportantDates = await this.prismaService.importantDates.create({
      data: {
        tag: createImportantDatesInput.tag,
        category: createImportantDatesInput.category,
        term: createImportantDatesInput.term,
        date: formattedDate,
        day: createImportantDatesInput.day,
        event: createImportantDatesInput.event,
        attachmentUrl: filePath,
        attachmentName: fileName,
        createdBy: userId.toString(),
        updatedBy: userId.toString(),
      },
    });

    return newImportantDates;
  }

  /**
   * Get all important dates
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<ImportantDates[]> {
    const skip = (page - 1) * limit; // Calculate how many records to skip

    return this.prismaService.importantDates.findMany({
      orderBy: { date: 'asc' }, // Sort by date in ascending order
      skip,
      take: limit, // Number of records to return
    });
  }
  /**
   * Find one important date entry by ID
   */
  async findOne(id: number): Promise<ImportantDates> {
    const importantDate = await this.prismaService.importantDates.findUnique({
      where: { id },
    });

    if (!importantDate) {
      throw new NotFoundException(`Important date with ID ${id} not found`);
    }

    return importantDate;
  }

  /**
   * Update an existing important date
   */
  async update(
    id: number,
    updateImportantDatesInput: UpdateImportantDatesInput,
    userId: string,
  ): Promise<ImportantDates> {
    const existingDate = await this.findOne(id); // Ensure it exists

    let attachmentUrl = existingDate.attachmentUrl;
    let attachmentName = existingDate.attachmentName;

    if (updateImportantDatesInput.attachmentFile) {
      // Handle new file upload
      const imageFile: any = await updateImportantDatesInput.attachmentFile;
      const fileName = `${Date.now()}_${imageFile.filename}`;
      attachmentUrl = await uploadFileStream(
        imageFile.createReadStream,
        this.uploadDir,
        fileName,
      );
      attachmentName = fileName;
    }

    const formattedDate = updateImportantDatesInput.date
      ? formatISO(new Date(updateImportantDatesInput.date))
      : existingDate.date;

    return this.prismaService.importantDates.update({
      where: { id },
      data: {
        tag: updateImportantDatesInput.tag || existingDate.tag,
        category: updateImportantDatesInput.category || existingDate.category,
        term: updateImportantDatesInput.term || existingDate.term,
        date: formattedDate,
        day: updateImportantDatesInput.day || existingDate.day,
        event: updateImportantDatesInput.event || existingDate.event,
        attachmentUrl,
        attachmentName,
        updatedBy: userId?.toString() || '',
      },
    });
  }

  /**
   * Delete an important date entry
   */
  async delete(id: number): Promise<ImportantDates> {
    let deleteItem = await this.findOne(id); // Ensure it exists before deleting

    await this.prismaService.importantDates.delete({
      where: { id },
    });

    return deleteItem;
  }
}
