import { addMonths } from "date-fns";

export function getSafeDueDate(
  startsOnRaw: Date,
  index: number,
  dueDate: number
): Date {
  const startsOn = new Date(startsOnRaw);
  const base = addMonths(startsOn, index);

  console.log(base);

  if (isNaN(base.getTime())) {
    throw new Error(`Invalid base date at index ${index}: ${startsOn}`);
  }

  const lastDay = new Date(
    base.getFullYear(),
    base.getMonth() + 1,
    0
  ).getDate();
  const safeDay = Math.min(dueDate, lastDay);
  const finalDate = new Date(base.setDate(safeDay));

  if (isNaN(finalDate.getTime())) {
    throw new Error(
      `Invalid final date at index ${index} | base: ${base} | safeDay: ${safeDay}`
    );
  }

  return finalDate;
}
