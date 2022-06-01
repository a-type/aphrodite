import { Context } from '@aphro/context-runtime-ts';
import TransactionLog from '@aphro/context-runtime-ts/src/transactionLog';
import { IPlan } from '../Plan.js';
import { Query } from '../Query.js';

type Status = 'pending' | 'resolved';

/*
How should we convert a query into a reactive plan?

A reactive plan --
1. List of tables hit
2. List of expressions

Mutated a thing in a hit table?
Jump to that section in the plan.
Look at the prior hop.
Incorporate the prior hop's condition into a filter.

MVP would just be to re-run the entire query if _any_ implicated table was updated.

Better would be to do this in-memory with the chaining of chunked iterables.

Second stage, and later, hops are non-optimizable however?
user.queryDecks().querySlides().queryComponents()
                    ^-- we don't know if the new/modified slide matches the join condition since the JC is unbound.
                    Well do we not?
                    join conditions would be on primary keys, fields and junctions.
                    we'd need to know if `slide.deckId` is within the set returned by `queryDecks`

MVP live queries will be non-optimistic unfortunately.
We can listen to `persistor` or we can listen to a transaction log.
*/
export default class LiveResult<T> {
  #latest?: T;
  #subscribers: Set<(data: T[]) => void>;
  #status: Status = 'pending';
  #optimizedQueryPlan: IPlan;
  #implicatedDatasets: Set<string>;

  #disposables: (() => void)[] = [];

  constructor(private ctx: Context, query: Query<T>) {
    this.#optimizedQueryPlan = query.plan().optimize();
    this.#implicatedDatasets = query.implicatedDatasets();

    this.#disposables.push(
      ctx.commitLog.observe(tx => {
        if (this.#matters(tx)) {
          // TODO: we have a divergence in optimistic results and db results.
          // I.e., the optimistic layer could succeed and persist layer fail.
          // We need to reoncile this for our users.
          tx.persist.then(this.#react);
        }
      }),
    );
  }

  // TODO: move definition of `Transaction`
  #matters(tx: any): boolean {
    // pull implicated datasets from tx
    // see if in #implicatedDatasets
    return false;
  }

  #react() {
    // TODO: we'd probably want to enable
    // streaming reactive updates, diff/patch updates, handling pagination in reactive queries
    this.#genReact().then(this.#notify);
  }

  async #genReact(): Promise<T[]> {
    let results: T[] = [];
    for await (const chunk of this.#optimizedQueryPlan.iterable) {
      results = results.concat(chunk);
    }

    return results;
  }

  #notify(result: T[]) {
    for (const s of this.#subscribers) {
      s(result);
    }
  }

  on(subscriber: (data: T[]) => void) {
    this.#subscribers.add(subscriber);
    return () => this.off(subscriber);
  }

  off(subscriber: (data: T[]) => void) {
    this.#subscribers.delete(subscriber);
  }

  destroy() {
    this.#subscribers = new Set();
    this.#disposables.forEach(d => d());
    this.#disposables = [];
    // this.ctx.commitLog.off(this.#logListener);
  }

  get latest() {
    return this.#latest;
  }

  get status() {
    return this.#status;
  }
}

/*
u.qeryAll().live().on(d => ...);
*/
