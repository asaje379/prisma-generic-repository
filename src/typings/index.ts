import { PaginationArgs, PaginationOptions } from 'nestjs-prisma-pagination';

export interface BaseModel {
  create: (data: unknown) => Promise<unknown>;
  createMany: (data: unknown) => Promise<unknown>;
  update: (data: unknown) => Promise<unknown>;
  findMany: (data: unknown) => Promise<unknown[]>;
  findFirst: (data: unknown) => Promise<unknown>;
  count: (data: unknown) => Promise<number>;
  delete: (data: unknown) => Promise<unknown>;
}

export type FindQuery<WhereInput> = {
  query?: WhereInput;
  paginationArgs?: PaginationArgs;
  paginationOptions?: PaginationOptions;
};

export type DownloadQuery<WhereInput, Input> = FindQuery<WhereInput> & {
  transformer?: (item: Input) => Record<string, string>;
  filename?: string;
};

export enum PeriodCountStep {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

export type PeriodCount = {
  step?: PeriodCountStep;
  lastN?: number;
  start?: string;
  end?: string;
};

export type QueryStats<WhereInput> = {
  query: WhereInput;
  count: PeriodCount;
};
