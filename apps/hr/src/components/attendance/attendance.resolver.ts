import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { AttendanceService } from "./attendance.service";
import {
  CreateAttendanceInput,
  UpdateAttendanceInput,
} from "../dto/attendance.input";
import { AttendancePaginatedResult } from "../dto/attendance.input"; // Adjust path if different
import { Attendance } from "../entities/attendance.entity";
import { NotFoundException } from "@nestjs/common";
import { GraphQLException } from "exceptions/graphql-exception";

// w

@Resolver(() => Attendance)
export class AttendanceResolver {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Mutation(() => Attendance)
  async createAttendance(
    @Args("createAttendanceInput") createAttendanceInput: CreateAttendanceInput
  ): Promise<Attendance> {
    try {
      return await this.attendanceService.create(createAttendanceInput);
    } catch (error) {
      throw new GraphQLException(
        "Failed to create attendance",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => AttendancePaginatedResult)
  async attendances(
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
    @Args("companyId", { type: () => String }) companyId: string
  ): Promise<AttendancePaginatedResult> {
    try {
      return await this.attendanceService.findAll(page, limit, companyId);
    } catch (error) {
      throw new GraphQLException(
        "Failed to fetch attendances",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => Attendance)
  async attendance(
    @Args("id", { type: () => Int }) id: number
  ): Promise<Attendance> {
    try {
      return await this.attendanceService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Attendance with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to fetch attendance",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => Attendance)
  async updateAttendance(
    @Args("id", { type: () => Int }) id: number,
    @Args("updateAttendanceInput") updateAttendanceInput: UpdateAttendanceInput
  ): Promise<Attendance> {
    try {
      return await this.attendanceService.update(id, updateAttendanceInput);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Attendance with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to update attendance",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => Attendance)
  async removeAttendance(
    @Args("id", { type: () => Int }) id: number
  ): Promise<Attendance> {
    try {
      return await this.attendanceService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Attendance with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to remove attendance",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => AttendancePaginatedResult)
  async searchAttendances(
    @Args("query", { type: () => String }) query: string,
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
    @Args("companyId", { type: () => String }) companyId: string
  ): Promise<AttendancePaginatedResult> {
    try {
      return await this.attendanceService.search(query, page, limit, companyId);
    } catch (error) {
      throw new GraphQLException(
        "Failed to search attendances",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }
}
