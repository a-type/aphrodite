// SIGNED-SOURCE: <6b193a47b3b5e0584ddf5b2647836045>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { default as s } from "./InvoiceLineSpec.js";
import { P } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import InvoiceLineQuery from "./InvoiceLineQuery.js";
import { Context } from "@aphro/runtime-ts";
import Invoice from "./Invoice.js";
import Track from "./Track.js";

export type Data = {
  id: SID_of<InvoiceLine>;
  invoiceId: SID_of<Invoice>;
  trackId: SID_of<Track>;
  unitPrice: number;
  quantity: number;
};

export default class InvoiceLine extends Node<Data> {
  readonly spec = s as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
  }

  get invoiceId(): SID_of<Invoice> {
    return this.data.invoiceId;
  }

  get trackId(): SID_of<Track> {
    return this.data.trackId;
  }

  get unitPrice(): number {
    return this.data.unitPrice;
  }

  get quantity(): number {
    return this.data.quantity;
  }

  static queryAll(ctx: Context): InvoiceLineQuery {
    return InvoiceLineQuery.create(ctx);
  }

  static async genx(
    ctx: Context,
    id: SID_of<InvoiceLine>
  ): Promise<InvoiceLine> {
    const existing = ctx.cache.get(id, InvoiceLine.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(
    ctx: Context,
    id: SID_of<InvoiceLine>
  ): Promise<InvoiceLine | null> {
    const existing = ctx.cache.get(id, InvoiceLine.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue();
  }
}
