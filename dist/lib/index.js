"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaGenericRepository = void 0;
const aoo_to_xlsx_1 = require("aoo_to_xlsx");
const crypto_1 = require("crypto");
const nestjs_prisma_pagination_1 = require("nestjs-prisma-pagination");
const utils_1 = require("../utils");
const os_1 = require("os");
class PrismaGenericRepository {
    create(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { select, include } = options !== null && options !== void 0 ? options : {
                select: undefined,
                include: undefined,
            };
            return yield this.model.create(Object.assign(Object.assign({ data }, (select ? { select } : {})), (include ? { include } : {})));
        });
    }
    createMany(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.createMany({ data });
        });
    }
    update(id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { select, include } = options !== null && options !== void 0 ? options : {
                select: undefined,
                include: undefined,
            };
            return yield this.model.update(Object.assign(Object.assign({ where: { id }, data }, (select ? { select } : {})), (include ? { include } : {})));
        });
    }
    updateBy(query, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { select, include } = options !== null && options !== void 0 ? options : {
                select: undefined,
                include: undefined,
            };
            const items = yield this.model.findMany({ where: query });
            const errors = [];
            for (const item of items) {
                try {
                    yield this.model.update(Object.assign(Object.assign({ where: { id: item.id }, data }, (select ? { select } : {})), (include ? { include } : {})));
                }
                catch (error) {
                    errors.push(error);
                }
            }
            if (errors.length) {
                return { isSuccess: false };
            }
            return { isSuccess: true };
        });
    }
    updateMany(items, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = [];
            const { select, include } = options !== null && options !== void 0 ? options : {
                select: undefined,
                include: undefined,
            };
            for (const item of items) {
                try {
                    yield this.model.update(Object.assign(Object.assign({ where: { id: item.id }, data: item.data }, (select ? { select } : {})), (include ? { include } : {})));
                }
                catch (error) {
                    errors.push(error);
                }
            }
            if (errors.length) {
                return { isSuccess: false };
            }
            return { isSuccess: true };
        });
    }
    getById(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { select, include } = options !== null && options !== void 0 ? options : {
                select: undefined,
                include: undefined,
            };
            return (yield this.model.findFirst(Object.assign(Object.assign({ where: { id } }, (select ? { select } : {})), (include ? { include } : {}))));
        });
    }
    get(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { select, include } = options !== null && options !== void 0 ? options : {
                select: undefined,
                include: undefined,
            };
            return (yield this.model.findFirst(Object.assign(Object.assign({ where: query }, (select ? { select } : {})), (include ? { include } : {}))));
        });
    }
    find({ query, paginationArgs, paginationOptions, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const _query = (0, nestjs_prisma_pagination_1.paginate)(paginationArgs, paginationOptions);
            _query.where = Object.assign(Object.assign(Object.assign({}, _query.where), query), { enabled: true });
            return (yield this.model.findMany(_query));
        });
    }
    count(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.count(query
                ? { where: Object.assign(Object.assign({}, query), { enabled: true }) }
                : { where: { enabled: true } });
        });
    }
    findAndCount({ query, paginationArgs, paginationOptions, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const values = (yield this.find({
                query,
                paginationArgs,
                paginationOptions,
            }));
            const count = yield this.count(query);
            return { count, values };
        });
    }
    download({ query, paginationArgs, paginationOptions, transformer, filename, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const values = yield this.find({
                query,
                paginationArgs,
                paginationOptions,
            });
            const data = values.map((item) => transformer
                ? transformer(item)
                : (0, utils_1.stringifyObject)(item));
            const _filename = filename ? filename : (0, crypto_1.randomUUID)();
            yield (0, aoo_to_xlsx_1.convertToSheet)(data, {
                path: (0, os_1.tmpdir)(),
                filename: _filename,
            });
            return `${(0, os_1.tmpdir)()}/${_filename}.xlsx`;
        });
    }
    archive(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.update(id, {
                enabled: false,
            }));
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(id, yield this.model.findFirst({ where: { id } }));
            return yield this.model.delete({ where: { id } });
        });
    }
    unarchive(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.update(id, { enabled: true }));
        });
    }
    archiveMany(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const id of ids) {
                yield this.archive(id);
            }
        });
    }
    deleteMany(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const id of ids) {
                yield this.delete(id);
            }
        });
    }
    unarchiveMany(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const id of ids) {
                yield this.unarchive(id);
            }
        });
    }
    archiveBy(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield this.model.findMany({
                where: query,
                select: { id: true },
            });
            for (const item of items) {
                yield this.archive(item.id);
            }
        });
    }
    deleteBy(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield this.model.findMany({
                where: query,
                select: { id: true },
            });
            for (const item of items) {
                yield this.delete(item.id);
            }
        });
    }
    unarchiveBy(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield this.model.findMany({
                where: query,
                select: { id: true },
            });
            for (const item of items) {
                yield this.unarchive(item.id);
            }
        });
    }
    stats(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const dates = (0, utils_1.countByPeriod)(args.count);
            const result = [];
            for (let i = 0, j = 1; j < dates.length; i++, j++) {
                const count = yield this.model.count({
                    where: Object.assign(Object.assign({}, args.query), { createdAt: { gte: dates[i], lt: dates[j] } }),
                });
                result.push({ date: dates[i], count });
            }
            return result;
        });
    }
}
exports.PrismaGenericRepository = PrismaGenericRepository;
//# sourceMappingURL=index.js.map