import { protectedProcedure } from "../trpc";

export const helloRotuer = {
  sayHello: protectedProcedure.query(({ ctx }) => {
    return `Hello user @${ctx.auth.userId}`;
  }),
};
