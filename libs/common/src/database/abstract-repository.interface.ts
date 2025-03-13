export interface AbstractRepository<T> {
    create(data: Partial<T>): Promise<T>;
    findById(id: number): Promise<T | null>;
    findAll(): Promise<T[]>;
    update(id: number, data: Partial<T>): Promise<T>;
    delete(id: number): Promise<void>;
  }
  