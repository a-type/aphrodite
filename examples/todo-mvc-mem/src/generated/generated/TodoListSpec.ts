// SIGNED-SOURCE: <09e416589dad3a9d4f5ea8baaa13fb44>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as TodoSpec } from "./TodoSpec.js";
import TodoList from "../TodoList.js";
import { Data } from "./TodoListBase.js";

const spec: NodeSpecWithCreate<TodoList, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], "todomvc", "todolist");
    if (existing) {
      return existing;
    }
    const result = new TodoList(ctx, data);
    ctx.cache.set(data["id"], result, "todomvc", "todolist");
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "memory",
    db: "todomvc",
    type: "memory",
    tablish: "todolist",
  },

  outboundEdges: {
    todos: {
      type: "foreignKey",
      sourceField: "id",
      destField: "listId",
      get source() {
        return spec;
      },
      get dest() {
        return TodoSpec;
      },
    },
  },
};

export default spec;
