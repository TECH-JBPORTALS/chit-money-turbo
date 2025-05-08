import { protectedProcedure } from "../trpc";

export const transactionsRouter = {
  /**
   * ### Get all transactions (payments & payouts)
   * @context subscriber
   *
   * ```ts
   * type Transaction = {
   *
   *
   * }
   * ```
   */
  getInfinitiyOfSubscriber: protectedProcedure.query(({ ctx }) => {}),
};
