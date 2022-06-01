import { Viewer } from './viewer';
import { DBResolver } from './DBResolver.js';
import { printResolver } from './resolvers.js';
import Cache from '@aphro/cache-runtime-ts';

export type Context = {
  readonly viewer: Viewer;
  readonly dbResolver: DBResolver;
  readonly cache: Cache;
  // readonly commitLog: TransactionLog;
};

// const defaultCommitLog = new TransactionLog(50);

/**
 * TODO: we should likely hide the cache parameter from the user so they don't shoot themselves in the foot
 * with respect to privacy by reusing the same cache across viewers.
 * @param viewer The current user that is viewing data
 * @param dbResolver The db lookup service
 * @param cache The cache to store resolved queries to.
 * @returns
 */
export default function context(
  viewer: Viewer,
  dbResolver: DBResolver,
  cache: Cache,
  // commitLog: TransactionLog = defaultCommitLog,
): Context {
  return {
    viewer,
    dbResolver,
    cache,
    // commitLog,
  };
}

export function debugContext(viewer: Viewer): Context {
  return context(viewer, printResolver, new Cache());
}

export function newFrom(oldContext: Context, newValues: Partial<Context>): Context {
  return {
    ...oldContext,
    ...newValues,
  };
}
