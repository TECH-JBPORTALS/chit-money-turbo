import { createRouteHandler } from "uploadthing/server";
import { uploadRouter } from "../../utils/__core";

const handlers = createRouteHandler({
  router: uploadRouter,

  // Apply an (optional) custom config:
  // config: { ... },
});

export { handlers as GET, handlers as POST };
