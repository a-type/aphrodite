import { nullthrows } from '@strut/utils';
import knex from 'knex';
import { DBResolver } from '@aphro/runtime-ts';

function createDb() {
  return knex({
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
  });
}

let db: ReturnType<typeof createDb> | null = null;
function createResolver(): DBResolver {
  if (db == null) {
    db = createDb();
  }

  return {
    type(t: 'sql') {
      return {
        engine(engine: 'sqlite') {
          return {
            db(dbName: string) {
              return {
                exec(query: string, bindings: any[]) {
                  return nullthrows(db).raw(query, bindings);
                },
                destroy() {
                  db?.destroy();
                },
              };
            },
          };
        },
      };
    },
  };
}

export const resolver = createResolver();
