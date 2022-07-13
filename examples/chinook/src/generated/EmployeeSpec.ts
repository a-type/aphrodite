// SIGNED-SOURCE: <44c835566aba6c86265380b71c86a75c>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as CustomerSpec } from "./CustomerSpec.js";
import Employee from "./Employee.js";
import { Data } from "./Employee.js";

const spec: NodeSpecWithCreate<Employee, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], Employee.name);
    if (existing) {
      return existing;
    }
    const result = new Employee(ctx, data);
    ctx.cache.set(data["id"], result);
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "chinook",
    type: "sql",
    tablish: "employee",
  },

  outboundEdges: {
    reportsTo: {
      type: "field",
      sourceField: "reportsToId",
      destField: "id",
      get source() {
        return spec;
      },
      get dest() {
        return spec;
      },
    },
    supports: {
      type: "foreignKey",
      sourceField: "id",
      destField: "supportRepId",
      get source() {
        return spec;
      },
      get dest() {
        return CustomerSpec;
      },
    },
  },
};

export default spec;
