import {
  BaseModel,
  DownloadQuery,
  FindQuery,
  QueryStats,
} from './../typings/index';
import { convertToSheet } from 'aoo_to_xlsx';
import { randomUUID } from 'crypto';
import { paginate } from 'nestjs-prisma-pagination';
import { countByPeriod, stringifyObject } from '../utils';
import { tmpdir } from 'os';

export class PrismaGenericRepository<
  Model extends BaseModel,
  Input,
  CreateInput,
  UpdateInput,
  WhereInput,
  SelectInput,
  IncludeInput = any,
> {
  protected model: Model | any;

  async create(
    data: CreateInput,
    options?: { select?: SelectInput; include?: IncludeInput },
  ) {
    const { select, include } = options ?? {
      select: undefined,
      include: undefined,
    };
    return await this.model.create({
      data,
      ...(select ? { select } : {}),
      ...(include ? { include } : {}),
    });
  }

  async createMany(data: Array<CreateInput>) {
    return await this.model.createMany({ data });
  }

  async update(
    id: string,
    data: UpdateInput,
    options?: { select?: SelectInput; include?: IncludeInput },
  ) {
    const { select, include } = options ?? {
      select: undefined,
      include: undefined,
    };
    return await this.model.update({
      where: { id },
      data,
      ...(select ? { select } : {}),
      ...(include ? { include } : {}),
    });
  }

  async updateBy(
    query: WhereInput,
    data: UpdateInput,
    options?: { select?: SelectInput; include?: IncludeInput },
  ) {
    const { select, include } = options ?? {
      select: undefined,
      include: undefined,
    };
    const items = await this.model.findMany({ where: query });
    const errors: Error[] = [];
    for (const item of items) {
      try {
        await this.model.update({
          where: { id: (item as { id: string }).id },
          data,
          ...(select ? { select } : {}),
          ...(include ? { include } : {}),
        });
      } catch (error: any) {
        errors.push(error);
      }
    }

    if (errors.length) {
      return { isSuccess: false };
    }

    return { isSuccess: true };
  }

  async updateMany(
    items: Array<{ id: string; data: UpdateInput }>,
    options?: { select?: SelectInput; include?: IncludeInput },
  ) {
    const errors: Error[] = [];
    const { select, include } = options ?? {
      select: undefined,
      include: undefined,
    };
    for (const item of items) {
      try {
        await this.model.update({
          where: { id: item.id },
          data: item.data,
          ...(select ? { select } : {}),
          ...(include ? { include } : {}),
        });
      } catch (error: any) {
        errors.push(error);
      }
    }

    if (errors.length) {
      return { isSuccess: false };
    }

    return { isSuccess: true };
  }

  async getById(
    id: string,
    options?: { select?: SelectInput; include?: IncludeInput },
  ) {
    const { select, include } = options ?? {
      select: undefined,
      include: undefined,
    };
    return (await this.model.findFirst({
      where: { id },
      ...(select ? { select } : {}),
      ...(include ? { include } : {}),
    })) as Input;
  }

  async get(
    query: WhereInput,
    options?: { select?: SelectInput; include?: IncludeInput },
  ) {
    const { select, include } = options ?? {
      select: undefined,
      include: undefined,
    };
    return (await this.model.findFirst({
      where: query,
      ...(select ? { select } : {}),
      ...(include ? { include } : {}),
    })) as Input;
  }

  async find({
    query,
    paginationArgs,
    paginationOptions,
  }: FindQuery<WhereInput>) {
    const _query = paginate(paginationArgs, paginationOptions);
    _query.where = { ..._query.where, ...query, enabled: true };
    return (await this.model.findMany(_query)) as Input[];
  }

  async count(query?: WhereInput): Promise<number> {
    return await this.model.count(
      query
        ? { where: { ...query, enabled: true } }
        : { where: { enabled: true } },
    );
  }

  async findAndCount({
    query,
    paginationArgs,
    paginationOptions,
  }: FindQuery<WhereInput>) {
    const values = (await this.find({
      query,
      paginationArgs,
      paginationOptions,
    })) as Input[];

    const finalQuery: Record<string, any> = { ...query };

    if (paginationOptions?.search) {
      const _query = paginate(paginationArgs, paginationOptions);
      finalQuery.OR = _query.OR;
    }

    const count = await this.count(finalQuery as WhereInput);
    return { count, values };
  }

  async download({
    query,
    paginationArgs,
    paginationOptions,
    transformer,
    filename,
  }: DownloadQuery<WhereInput, Input>) {
    const values = await this.find({
      query,
      paginationArgs,
      paginationOptions,
    });

    const data = (values as unknown[]).map((item) =>
      transformer
        ? transformer(item as Input)
        : stringifyObject(item as Record<string, unknown>),
    );
    const _filename = filename ? filename : randomUUID();

    await convertToSheet(data, {
      path: tmpdir(),
      filename: _filename,
    });
    return `${tmpdir()}/${_filename}.xlsx`;
  }

  async archive(id: string) {
    return (await this.update(id, {
      enabled: false,
    } as UpdateInput)) as Input;
  }

  async delete(id: string) {
    console.log(id, await this.model.findFirst({ where: { id } }));

    return await this.model.delete({ where: { id } });
  }

  async unarchive(id: string) {
    return (await this.update(id, { enabled: true } as UpdateInput)) as Input;
  }

  async archiveMany(ids: string[]) {
    for (const id of ids) {
      await this.archive(id);
    }
  }

  async deleteMany(ids: string[]) {
    for (const id of ids) {
      await this.delete(id);
    }
  }

  async unarchiveMany(ids: string[]) {
    for (const id of ids) {
      await this.unarchive(id);
    }
  }

  async archiveBy(query: WhereInput) {
    const items = await this.model.findMany({
      where: query,
      select: { id: true },
    });

    for (const item of items) {
      await this.archive((item as { id: string }).id);
    }
  }

  async deleteBy(query: WhereInput) {
    const items = await this.model.findMany({
      where: query,
      select: { id: true },
    });

    for (const item of items) {
      await this.delete((item as { id: string }).id);
    }
  }

  async unarchiveBy(query: WhereInput) {
    const items = await this.model.findMany({
      where: query,
      select: { id: true },
    });

    for (const item of items) {
      await this.unarchive((item as { id: string }).id);
    }
  }

  async stats(args: QueryStats<WhereInput>) {
    const dates = countByPeriod(args.count);
    const result: { date: Date; count: number }[] = [];
    for (let i = 0, j = 1; j < dates.length; i++, j++) {
      const count = await this.model.count({
        where: { ...args.query, createdAt: { gte: dates[i], lt: dates[j] } },
      });
      result.push({ date: dates[i], count });
    }
    return result;
  }
}
