import type { ParseISOOptions } from 'date-fns';
import { parseISO, addMinutes, isWithinInterval } from 'date-fns';

export const isNowBetweenDates = (startDate: Date, endDate: Date) => {
  return isWithinInterval(new Date(), { start: startDate, end: endDate });
};

export const calculateEndDate = (startDate: Date, duration: number) => {
  return addMinutes(startDate, duration);
};

export const isOngoing = (startDate: Date, duration: number) => {
  return isNowBetweenDates(startDate, calculateEndDate(startDate, duration));
};

export const parseISODate = (
  dateISO: string,
  options?: ParseISOOptions<Date>,
) => {
  return parseISO(dateISO, options);
};
