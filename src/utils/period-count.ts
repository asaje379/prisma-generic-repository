import { PeriodCount, PeriodCountStep } from '../typings';

const PERIOD_COUNT_STEP_VALUE = {
  [PeriodCountStep.DAY]: 1,
  [PeriodCountStep.WEEK]: 7,
  [PeriodCountStep.MONTH]: 28,
  [PeriodCountStep.YEAR]: 364,
};

function startOfDay(value: Date) {
  return new Date(value.setHours(0, 0, 0));
}

function endOfDay(value: Date) {
  return new Date(value.setHours(23, 59, 59));
}

function lastNPeriodStart(date: Date, step: PeriodCountStep, value: number) {
  const _date = date;
  if (step === PeriodCountStep.DAY) {
    return new Date(_date.setDate(_date.getDate() - value));
  }

  if (step === PeriodCountStep.WEEK) {
    return new Date(_date.setDate(_date.getDate() - value * 7));
  }

  if (step === PeriodCountStep.MONTH) {
    return new Date(_date.setMonth(_date.getMonth() - value));
  }

  if (step === PeriodCountStep.YEAR) {
    return new Date(_date.setMonth(_date.getMonth() - value * 12));
  }

  return new Date();
}

export function everyBetween(start: Date, end: Date, value = 1) {
  const dates = [];
  let current = start;
  while (current.getTime() < end.getTime()) {
    dates.push(current);
    current = new Date(current.setDate(current.getDate() + value));
  }
  return dates;
}

export function countByPeriod(args: PeriodCount) {
  const _end = endOfDay(args.end ? new Date(args.end) : new Date());
  const _start = startOfDay(
    args.start
      ? new Date(args.start)
      : lastNPeriodStart(
          new Date(),
          args.step ?? PeriodCountStep.DAY,
          args.lastN ?? 6,
        ),
  );
  return everyBetween(
    _start,
    _end,
    PERIOD_COUNT_STEP_VALUE[args.step ?? PeriodCountStep.DAY],
  );
}
