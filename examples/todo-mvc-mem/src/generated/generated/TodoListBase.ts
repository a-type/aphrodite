// SIGNED-SOURCE: <8de97ca5c3a688616bfed6b28a317cdf>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import TodoList from "../TodoList.js";
import { default as s } from "./TodoListSpec.js";
import { P } from "@aphro/runtime-ts";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import TodoListQuery from "./TodoListQuery.js";
import { Context } from "@aphro/runtime-ts";
import TodoQuery from "./TodoQuery.js";
import Todo from "../Todo.js";

export type Data = {
  id: SID_of<TodoList>;
  filter: "all" | "active" | "completed";
  editing: SID_of<Todo> | null;
};

// @Sealed(TodoList)
export default abstract class TodoListBase extends Node<Data> {
  readonly spec = s as unknown as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as unknown as SID_of<this>;
  }

  get filter(): "all" | "active" | "completed" {
    return this.data.filter;
  }

  get editing(): SID_of<Todo> | null {
    return this.data.editing;
  }

  queryTodos(): TodoQuery {
    return TodoQuery.create(this.ctx).whereListId(P.equals(this.id as any));
  }

  static queryAll(ctx: Context): TodoListQuery {
    return TodoListQuery.create(ctx);
  }

  static async genx(ctx: Context, id: SID_of<TodoList>): Promise<TodoList> {
    const existing = ctx.cache.get(id, "todomvc", "todolist");
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(
    ctx: Context,
    id: SID_of<TodoList>
  ): Promise<TodoList | null> {
    const existing = ctx.cache.get(id, "todomvc", "todolist");
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue();
  }

  update(data: Partial<Data>) {
    return new UpdateMutationBuilder(this.ctx, this.spec, this)
      .set(data)
      .toChangeset();
  }

  static create(ctx: Context, data: Partial<Data>) {
    return new CreateMutationBuilder(ctx, s).set(data).toChangeset();
  }

  delete() {
    return new DeleteMutationBuilder(this.ctx, this.spec, this).toChangeset();
  }
}
