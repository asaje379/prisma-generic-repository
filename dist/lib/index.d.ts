import { BaseModel, DownloadQuery, FindQuery, QueryStats } from './../typings/index';
export declare class PrismaGenericRepository<Model extends BaseModel, Input, CreateInput, UpdateInput, WhereInput, SelectInput> {
    protected model: Model | any;
    create(data: CreateInput, options?: {
        select?: SelectInput;
        include?: any;
    }): Promise<any>;
    createMany(data: Array<CreateInput>): Promise<any>;
    update(id: string, data: UpdateInput, options?: {
        select?: SelectInput;
        include?: any;
    }): Promise<any>;
    updateBy(query: WhereInput, data: UpdateInput, options?: {
        select?: SelectInput;
        include?: any;
    }): Promise<{
        isSuccess: boolean;
    }>;
    updateMany(items: Array<{
        id: string;
        data: UpdateInput;
    }>, options?: {
        select?: SelectInput;
        include?: any;
    }): Promise<{
        isSuccess: boolean;
    }>;
    getById(id: string, options?: {
        select?: SelectInput;
        include?: any;
    }): Promise<Input>;
    get(query: WhereInput, options?: {
        select?: SelectInput;
        include?: any;
    }): Promise<Input>;
    find({ query, paginationArgs, paginationOptions, }: FindQuery<WhereInput>): Promise<Input[]>;
    count(query?: WhereInput): Promise<number>;
    findAndCount({ query, paginationArgs, paginationOptions, }: FindQuery<WhereInput>): Promise<{
        count: number;
        values: Input[];
    }>;
    download({ query, paginationArgs, paginationOptions, transformer, filename, }: DownloadQuery<WhereInput, Input>): Promise<string>;
    archive(id: string): Promise<Input>;
    delete(id: string): Promise<any>;
    unarchive(id: string): Promise<Input>;
    archiveMany(ids: string[]): Promise<void>;
    deleteMany(ids: string[]): Promise<void>;
    unarchiveMany(ids: string[]): Promise<void>;
    archiveBy(query: WhereInput): Promise<void>;
    deleteBy(query: WhereInput): Promise<void>;
    unarchiveBy(query: WhereInput): Promise<void>;
    stats(args: QueryStats<WhereInput>): Promise<{
        date: Date;
        count: number;
    }[]>;
}
