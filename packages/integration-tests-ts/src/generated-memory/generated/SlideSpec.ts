// SIGNED-SOURCE: <150dcb627edd6a7ea8c18ebeea6cb2ef>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as ComponentSpec } from "./ComponentSpec.js";
import Slide from "../Slide.js";
import { Data } from "./SlideBase.js";

const SlideSpec: NodeSpecWithCreate<Slide, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], "none", "slide");
    if (existing) {
      return existing;
    }
    const result = new Slide(ctx, data);
    ctx.cache.set(data["id"], result, "none", "slide");
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "memory",
    db: "none",
    type: "memory",
    tablish: "slide",
  },

  outboundEdges: {
    components: {
      type: "foreignKey",
      sourceField: "id",
      destField: "slideId",
      get source() {
        return SlideSpec;
      },
      get dest() {
        return ComponentSpec;
      },
    },
  },
};

export default SlideSpec;
