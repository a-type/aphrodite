import { Context } from '@aphro/context-runtime-ts';
import { IModel, MutableHeteroModelMap } from '@aphro/model-runtime-ts';
import { HeteroModelMap } from '@aphro/model-runtime-ts';
import { SID_of } from '@strut/sid';
import { Changeset } from './Changeset.js';
import { Task } from './NotifyQueue.js';

export type CombinedChangesets = Map<SID_of<IModel>, Changeset<IModel>>;
export type Transaction = {
  readonly changes: Map<SID_of<IModel>, Changeset<IModel>>;
  readonly nodes: HeteroModelMap;
  // readonly options: CommitOptions;
};

export class ChangesetExecutor {
  constructor(
    private ctx: Context,
    private changesets: Changeset<IModel>[],
  ) // private options: CommitOptions = {},
  {}

  // Ideally we return the transaction list...
  // to replicate to logs.
  execute(): Transaction {
    // Merge multiple updates to the same object into a single changeset
    const combined = this._combineChangesets();
    this.removeNoops(combined);
    const [transaction, notifications] = this.apply(combined);

    // TODO: maybe allow this...
    // this.context.commitLog.push(transaction);

    // TODO: Should we do this tick or next tick?
    setTimeout(() => {
      for (const n of notifications) {
        n();
      }
    }, 0);

    return transaction;
  }

  private removeNoops(changesets: CombinedChangesets) {
    for (const [id, changeset] of changesets) {
      if (changeset.type === 'update') {
        if (changeset.model._isNoop(changeset.updates)) {
          changesets.delete(id);
        }
      }
    }
  }

  private apply(changesets: CombinedChangesets): [Transaction, Set<Task>] {
    const nodes = new MutableHeteroModelMap();
    const notifications: Set<Task> = new Set();
    for (const [id, cs] of changesets) {
      const [model, notifBatch] = this.processChanges(cs);
      nodes.set(id, model);
      for (const notif of notifBatch) {
        notifications.add(notif);
      }
    }
    return [
      {
        changes: changesets,
        nodes,
        // options: this.options,
      },
      notifications,
    ];
  }

  private processChanges(changeset: Changeset<IModel>): [IModel | null, Set<() => void>] {
    switch (changeset.type) {
      case 'create': {
        const ret = changeset.spec.createFrom(this.ctx, changeset.updates as any);
        this.ctx.cache.set(ret.id, ret);
        const [_, notifs] = ret._merge(changeset.updates);
        return [ret, notifs];
      }
      case 'update': {
        const [_, notifs] = changeset.model._merge(changeset.updates);
        return [changeset.model, notifs];
      }
      case 'delete': {
        this.ctx.cache.remove(changeset.id);
        const node = changeset.model;
        // TODO: delete notifications?
        node.destroy();
        return [null, new Set()];
      }
    }
  }

  _combineChangesets(): CombinedChangesets {
    const merged: CombinedChangesets = new Map();
    for (const changeset of this.changesets) {
      const existing = merged.get(changeset.id);

      if (!existing) {
        merged.set(changeset.id, changeset);
        continue;
      }

      if (existing.type === 'delete') {
        // No need to merge. Deleted is deleted.
        continue;
      }

      if (changeset.type === 'delete') {
        // Replace the existing one with the delete.
        merged.set(changeset.id, changeset);
        continue;
      }

      if (changeset.type === 'create') {
        throw new Error('Creating the same node twice');
      }

      if (existing.type === 'create') {
        throw new Error('Updating a nod ebefore it is created');
      }

      merged.set(changeset.id, {
        type: 'update',
        updates: {
          ...existing.updates,
          ...changeset.updates,
        },
        spec: changeset.model.spec,
        model: changeset.model,
        id: changeset.id,
      });
    }

    return merged;
  }
}
