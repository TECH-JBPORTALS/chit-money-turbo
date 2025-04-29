import { z } from "zod";

export const paginateInputSchema = z.object({
  pageIndex: z.number().min(0).default(0),
  pageSize: z.number().min(1).max(100).default(10),
});

export const getPagination = (pageIndex: number, pageSize: number) => ({
  offset: pageIndex * pageSize,
  pageSize,
});
