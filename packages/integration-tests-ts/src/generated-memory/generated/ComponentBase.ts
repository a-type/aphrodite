// SIGNED-SOURCE: <dae8df8e5deb2a88710538e10992ec8f>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import Component from "../Component.js";
import { default as s } from "./ComponentSpec.js";
import { P } from "@aphro/runtime-ts";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { modelGenMemo } from "@aphro/runtime-ts";
import { OptimisticPromise } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import ComponentQuery from "./ComponentQuery.js";
import { Context } from "@aphro/runtime-ts";
import Slide from "../Slide.js";

export type Data = {
  id: SID_of<Component>;
  subtype: "Text" | "Embed";
  slideId: SID_of<Slide>;
  content: string;
};

// @Sealed(Component)
export default abstract class ComponentBase extends Node<Data> {
  readonly spec = s as unknown as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as unknown as SID_of<this>;
  }

  get subtype(): "Text" | "Embed" {
    return this.data.subtype;
  }

  get slideId(): SID_of<Slide> {
    return this.data.slideId;
  }

  get content(): string {
    return this.data.content;
  }

  static queryAll(ctx: Context): ComponentQuery {
    return ComponentQuery.create(ctx);
  }

  static genx = modelGenMemo(
    "none",
    "component",
    (ctx: Context, id: SID_of<Component>): OptimisticPromise<Component> =>
      new OptimisticPromise((resolve, reject) =>
        this.queryAll(ctx)
          .whereId(P.equals(id))
          .genxOnlyValue()
          .then(resolve, reject)
      )
  );

  static gen = modelGenMemo(
    "none",
    "component",
    (
      ctx: Context,
      id: SID_of<Component>
    ): OptimisticPromise<Component | null> =>
      new OptimisticPromise((resolve, reject) =>
        this.queryAll(ctx)
          .whereId(P.equals(id))
          .genOnlyValue()
          .then(resolve, reject)
      )
  );

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
