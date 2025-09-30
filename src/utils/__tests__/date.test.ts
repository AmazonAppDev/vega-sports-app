import {
  isNowBetweenDates,
  calculateEndDate,
  isOngoing,
  parseISODate,
} from '../date';

describe('date utils', () => {
  describe('isNowBetweenDates', () => {
    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    test.each([
      {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02'),
        now: new Date('2024-01-01T12:00:00'),
        expected: true,
      },
      {
        startDate: new Date('2024-01-01T10:00:00'),
        endDate: new Date('2024-01-01T11:30:00'),
        now: new Date('2024-01-01T11:00:00'),
        expected: true,
      },
    ])(
      'returns true when current date/time ($now) is within startDate and endDate range',
      ({ startDate, endDate, now }) => {
        jest.useFakeTimers().setSystemTime(now);

        const result = isNowBetweenDates(startDate, endDate);

        expect(result).toBe(true);
      },
    );

    test.each([
      {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-01T11:00:00'),
        now: new Date('2024-01-01T12:00:00'),
      },
    ])(
      'returns false when current date/time ($now) is after endDate',
      ({ startDate, endDate, now }) => {
        jest.useFakeTimers().setSystemTime(now);

        const result = isNowBetweenDates(startDate, endDate);

        expect(result).toBe(false);
      },
    );

    test.each([
      {
        startDate: new Date('2024-01-011T10:00:00'),
        endDate: new Date('2024-01-01T11:00:00'),
        now: new Date('2024-01-01T09:00:00'),
      },
    ])(
      'returns false when current date/time ($now) is before startDate',
      ({ startDate, endDate, now }) => {
        jest.useFakeTimers().setSystemTime(now);

        const result = isNowBetweenDates(startDate, endDate);

        expect(result).toBe(false);
      },
    );
  });

  describe('calculateEndDate', () => {
    test.each([
      {
        startDate: new Date('2024-01-01T10:00:00'),
        duration: 60,
        expectedEndDate: new Date('2024-01-01T11:00:00'),
      },
      {
        startDate: new Date('2024-01-01T10:00:00'),
        duration: 30,
        expectedEndDate: new Date('2024-01-01T10:30:00'),
      },
      {
        startDate: new Date('2024-01-01T23:30:00'),
        duration: 90,
        expectedEndDate: new Date('2024-01-02T01:00:00'),
      },
    ])(
      'returns properly calculated endDate when adding $input.duration minutes to startDate',
      ({ startDate, duration, expectedEndDate }) => {
        const result = calculateEndDate(startDate, duration);

        expect(result).toEqual(expectedEndDate);
      },
    );
  });

  describe('isOngoing', () => {
    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    test.each([
      {
        startDate: new Date('2024-01-01T10:00:00'),
        duration: 60,
        now: new Date('2024-01-01T10:30:00'),
      },
      {
        startDate: new Date('2024-01-01T10:00:00'),
        duration: 120,
        now: new Date('2024-01-01T11:00:00'),
      },
    ])(
      'returns true when now date is within range calculated from startDate and duration',
      ({ startDate, duration, now }) => {
        jest.useFakeTimers().setSystemTime(now);

        const result = isOngoing(startDate, duration);

        expect(result).toBe(true);
      },
    );

    test.each([
      {
        startDate: new Date('2024-01-01T10:00:00'),
        duration: 60,
        now: new Date('2024-01-01T09:00:00'),
      },
    ])(
      'returns false when now date is before startDate',
      ({ startDate, duration, now }) => {
        jest.useFakeTimers().setSystemTime(now);

        const result = isOngoing(startDate, duration);

        expect(result).toBe(false);
      },
    );

    test.each([
      {
        startDate: new Date('2024-01-01T10:00:00'),
        duration: 60,
        now: new Date('2024-01-01T12:00:00'),
      },
    ])(
      'returns false when now date is after calculated date from startDate and duration',
      ({ startDate, duration, now }) => {
        jest.useFakeTimers().setSystemTime(now);

        const result = isOngoing(startDate, duration);

        expect(result).toBe(false);
      },
    );
  });

  describe('parseISODate', () => {
    test.each([
      {
        dateISO: '2024-01-01T10:00:00Z',
        expectedDate: new Date('2024-01-01T10:00:00Z'),
      },
      {
        dateISO: '2024-02-15T23:45:00Z',
        expectedDate: new Date('2024-02-15T23:45:00Z'),
      },
      {
        dateISO: '2023-12-31T00:00:00Z',
        expectedDate: new Date('2023-12-31T00:00:00Z'),
      },
    ])(
      'parses date in ISO format ($dateISO) correctly',
      ({ dateISO, expectedDate }) => {
        const result = parseISODate(dateISO);

        expect(result).toEqual(expectedDate);
      },
    );
  });
});
