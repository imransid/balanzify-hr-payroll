import { PrismaClient } from '@prisma/client';
import { AbstractRepository } from './abstract-repository.interface';

export abstract class PrismaRepository<T> implements AbstractRepository<T> {
  constructor(protected readonly prisma: PrismaClient, private readonly modelName: keyof PrismaClient) {}

  async create(data: Partial<T>): Promise<T> {
    return this.prisma[this.modelName].create({ data }) as Promise<T>;
  }

  async findById(id: number): Promise<T | null> {
    return this.prisma[this.modelName].findUnique({ where: { id } }) as Promise<T | null>;
  }

  async findAll(): Promise<T[]> {
    return this.prisma[this.modelName].findMany() as Promise<T[]>;
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    return this.prisma[this.modelName].update({ where: { id }, data }) as Promise<T>;
  }

  async delete(id: number): Promise<void> {
    await this.prisma[this.modelName].delete({ where: { id } });
  }
}