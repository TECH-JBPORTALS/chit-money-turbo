import { z, ZodAny, ZodAnyDef, ZodParsedType, ZodType, ZodTypeDef } from "zod";

export const makeResponse = <T extends ZodType>(dataShape: T) => {
  return z.object({
    status: z.string(),
    data: dataShape,
    error: z.null(),
  });
};
