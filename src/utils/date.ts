/**
 * Date and Time utilities for LifeOS
 */

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/**
 * Format YYYY-MM-DD into a human-friendly label relative to today
 */
export function formatTaskDueDate(
  dueDate: string,
  todayDate: string
): { label: string; isOverdue: boolean; isToday: boolean; isTomorrow: boolean } {
  if (!dueDate) {
    return { label: 'No date', isOverdue: false, isToday: false, isTomorrow: false };
  }

  const isToday = dueDate === todayDate;
  const isOverdue = dueDate < todayDate;

  // Check tomorrow
  const [year, month, day] = todayDate.split('-').map(Number);
  const todayObj = new Date(year, month - 1, day);
  const tomorrowObj = new Date(todayObj);
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrowStr = `${tomorrowObj.getFullYear()}-${String(tomorrowObj.getMonth() + 1).padStart(2, '0')}-${String(tomorrowObj.getDate()).padStart(2, '0')}`;
  const isTomorrow = dueDate === tomorrowStr;

  if (isToday) return { label: 'Today', isOverdue: false, isToday: true, isTomorrow: false };
  if (isTomorrow) return { label: 'Tomorrow', isOverdue: false, isToday: false, isTomorrow: true };

  const [tYear, tMonth, tDay] = dueDate.split('-').map(Number);
  const dueObj = new Date(tYear, tMonth - 1, tDay);
  const formatted = dueObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return {
    label: isOverdue ? `${formatted} (Overdue)` : formatted,
    isOverdue,
    isToday,
    isTomorrow,
  };
}

export interface CalendarGridDay {
  date: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  dayOfWeek: number; // 0 = Mon, 6 = Sun
}

/**
 * Generates days for a full 35 or 42 day month grid (Monday start)
 */
export function getMonthGrid(year: number, month: number, todayDate: string): CalendarGridDay[] {
  // month is 0-indexed (0 = Jan, 10 = Nov)
  const firstDayOfMonth = new Date(year, month, 1);
  // getDay() gives 0 for Sun, 1 for Mon... we want 0 for Mon, 6 for Sun
  const firstDayWeekday = (firstDayOfMonth.getDay() + 6) % 7;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const grid: CalendarGridDay[] = [];

  // Previous month trailing days
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevMonthDate = new Date(year, month - 1, dayNum);
    const dateStr = formatDateString(prevMonthDate);
    grid.push({
      date: dateStr,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: dateStr === todayDate,
      dayOfWeek: (prevMonthDate.getDay() + 6) % 7,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const currDate = new Date(year, month, i);
    const dateStr = formatDateString(currDate);
    grid.push({
      date: dateStr,
      dayNumber: i,
      isCurrentMonth: true,
      isToday: dateStr === todayDate,
      dayOfWeek: (currDate.getDay() + 6) % 7,
    });
  }

  // Next month leading days to complete the full 35 or 42 grid cells
  const remainingCells = (7 - (grid.length % 7)) % 7;
  const targetTotal = grid.length + remainingCells < 35 ? 35 - grid.length : remainingCells;

  for (let i = 1; i <= targetTotal; i++) {
    const nextMonthDate = new Date(year, month + 1, i);
    const dateStr = formatDateString(nextMonthDate);
    grid.push({
      date: dateStr,
      dayNumber: i,
      isCurrentMonth: false,
      isToday: dateStr === todayDate,
      dayOfWeek: (nextMonthDate.getDay() + 6) % 7,
    });
  }

  return grid;
}

/**
 * Returns 7 days for the week containing the reference date (Monday - Sunday)
 */
export function getWeekDays(
  baseDateStr: string,
  todayDate: string
): { date: string; dayName: string; dayNumber: number; isToday: boolean }[] {
  const [year, month, day] = baseDateStr.split('-').map(Number);
  const baseDate = new Date(year, month - 1, day);
  const weekday = (baseDate.getDay() + 6) % 7; // 0 = Mon, 6 = Sun

  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() - weekday);

  const days: { date: string; dayName: string; dayNumber: number; isToday: boolean }[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = formatDateString(d);
    days.push({
      date: dateStr,
      dayName: DAY_NAMES[i],
      dayNumber: d.getDate(),
      isToday: dateStr === todayDate,
    });
  }

  return days;
}

export function formatDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Calculates current active streak for a habit ending today or yesterday
 */
export function calculateHabitStreak(completedDates: string[], todayDate: string): number {
  if (!completedDates || completedDates.length === 0) return 0;
  const dateSet = new Set(completedDates);

  const [y, m, d] = todayDate.split('-').map(Number);
  const cur = new Date(y, m - 1, d);

  const isTodayDone = dateSet.has(todayDate);

  // If today is not done, check if yesterday was done. If neither, streak is 0.
  const yesterday = new Date(cur);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDateString(yesterday);
  const isYesterdayDone = dateSet.has(yesterdayStr);

  if (!isTodayDone && !isYesterdayDone) {
    return 0;
  }

  // Count backwards from today (if today done) or from yesterday (if today not done)
  const checkDate = isTodayDone ? new Date(cur) : yesterday;
  let streak = 0;

  while (true) {
    const str = formatDateString(checkDate);
    if (dateSet.has(str)) {
      streak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Returns an array of YYYY-MM-DD date strings for the past N days leading up to today
 */
export function getLastNDays(todayDate: string, n: number): string[] {
  const [y, m, d] = todayDate.split('-').map(Number);
  const base = new Date(y, m - 1, d);
  const result: string[] = [];

  for (let i = n - 1; i >= 0; i--) {
    const day = new Date(base);
    day.setDate(day.getDate() - i);
    result.push(formatDateString(day));
  }

  return result;
}


