import { protectedProcedure } from "../trpc";

export const helloRotuer = {
  sayHello: protectedProcedure.query(({ ctx }) => {
    return ctx.collectorsDb.query.users.findMany();
  }),
};
