"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countByPeriod = exports.everyBetween = void 0;
const typings_1 = require("../typings");
const PERIOD_COUNT_STEP_VALUE = {
    [typings_1.PeriodCountStep.DAY]: 1,
    [typings_1.PeriodCountStep.WEEK]: 7,
    [typings_1.PeriodCountStep.MONTH]: 28,
    [typings_1.PeriodCountStep.YEAR]: 364,
};
function startOfDay(value) {
    return new Date(value.setHours(0, 0, 0));
}
function endOfDay(value) {
    return new Date(value.setHours(23, 59, 59));
}
function lastNPeriodStart(date, step, value) {
    const _date = date;
    if (step === typings_1.PeriodCountStep.DAY) {
        return new Date(_date.setDate(_date.getDate() - value));
    }
    if (step === typings_1.PeriodCountStep.WEEK) {
        return new Date(_date.setDate(_date.getDate() - value * 7));
    }
    if (step === typings_1.PeriodCountStep.MONTH) {
        return new Date(_date.setMonth(_date.getMonth() - value));
    }
    if (step === typings_1.PeriodCountStep.YEAR) {
        return new Date(_date.setMonth(_date.getMonth() - value * 12));
    }
    return new Date();
}
function everyBetween(start, end, value = 1) {
    const dates = [];
    let current = start;
    while (current.getTime() < end.getTime()) {
        dates.push(current);
        current = new Date(current.setDate(current.getDate() + value));
    }
    return dates;
}
exports.everyBetween = everyBetween;
function countByPeriod(args) {
    var _a, _b, _c;
    const _end = endOfDay(args.end ? new Date(args.end) : new Date());
    const _start = startOfDay(args.start
        ? new Date(args.start)
        : lastNPeriodStart(new Date(), (_a = args.step) !== null && _a !== void 0 ? _a : typings_1.PeriodCountStep.DAY, (_b = args.lastN) !== null && _b !== void 0 ? _b : 6));
    return everyBetween(_start, _end, PERIOD_COUNT_STEP_VALUE[(_c = args.step) !== null && _c !== void 0 ? _c : typings_1.PeriodCountStep.DAY]);
}
exports.countByPeriod = countByPeriod;
//# sourceMappingURL=period-count.js.map