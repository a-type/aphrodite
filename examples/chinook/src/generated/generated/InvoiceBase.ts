// SIGNED-SOURCE: <25eae544fca0bec5ae63b2ab95ff5cf5>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import Invoice from "../Invoice.js";
import { default as s } from "./InvoiceSpec.js";
import { P } from "@aphro/runtime-ts";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { OptimisticPromise } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import InvoiceQuery from "./InvoiceQuery.js";
import { Context } from "@aphro/runtime-ts";
import CustomerQuery from "./CustomerQuery.js";
import CustomerSpec from "./CustomerSpec.js";
import InvoiceLineQuery from "./InvoiceLineQuery.js";
import InvoiceLine from "../InvoiceLine.js";
import Customer from "../Customer.js";

export type Data = {
  id: SID_of<Invoice>;
  customerId: SID_of<Customer>;
  invoiceDate: number;
  billingAddress: string | null;
  billingCity: string | null;
  billingState: string | null;
  billingCountry: string | null;
  billingPostalCode: string | null;
  total: number;
};

// @Sealed(Invoice)
export default abstract class InvoiceBase extends Node<Data> {
  readonly spec = s as unknown as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as unknown as SID_of<this>;
  }

  get customerId(): SID_of<Customer> {
    return this.data.customerId;
  }

  get invoiceDate(): number {
    return this.data.invoiceDate;
  }

  get billingAddress(): string | null {
    return this.data.billingAddress;
  }

  get billingCity(): string | null {
    return this.data.billingCity;
  }

  get billingState(): string | null {
    return this.data.billingState;
  }

  get billingCountry(): string | null {
    return this.data.billingCountry;
  }

  get billingPostalCode(): string | null {
    return this.data.billingPostalCode;
  }

  get total(): number {
    return this.data.total;
  }

  queryCustomer(): CustomerQuery {
    return CustomerQuery.fromId(this.ctx, this.customerId);
  }
  queryLines(): InvoiceLineQuery {
    return InvoiceLineQuery.create(this.ctx).whereInvoiceId(
      P.equals(this.id as any)
    );
  }

  genCustomer(): OptimisticPromise<Customer> {
    const existing = this.ctx.cache.get(
      this.customerId,
      CustomerSpec.storage.db,
      CustomerSpec.storage.tablish
    );
    if (existing != null) {
      const ret = new OptimisticPromise<Customer>((resolve) =>
        resolve(existing)
      );
      ret.__setOptimisticResult(existing);
      return ret;
    }
    return new OptimisticPromise((resolve, reject) =>
      this.queryCustomer().genxOnlyValue().then(resolve, reject)
    );
  }

  static queryAll(ctx: Context): InvoiceQuery {
    return InvoiceQuery.create(ctx);
  }

  static async genx(ctx: Context, id: SID_of<Invoice>): Promise<Invoice> {
    const existing = ctx.cache.get(id, "chinook", "invoice");
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(ctx: Context, id: SID_of<Invoice>): Promise<Invoice | null> {
    const existing = ctx.cache.get(id, "chinook", "invoice");
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
