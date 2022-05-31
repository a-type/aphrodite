/**
 * Derived from https://github.com/gammaql/greldal/blob/20f65226256ec217ea056bf7e0c1eca48b5bb721/src/docs/utils/SQLJSClient.js
 *  & https://github.com/ngokevin/expo-sqlite-plus-web/blob/main/src/db.web.ts#L22
 */
import SQLiteClient from 'knex/lib/dialects/sqlite3';
import Connection from './connection';

export default class AbsurdSqlClient extends SQLiteClient {
  dialect = 'absurd-sql';
  driverName = 'absurd-sql';

  _driver() {
    throw new Error('ExpectedToNotBeReachable');
  }

  acquireRawConnection() {
    return new Promise(async (resolve, reject) => {
      const connection = new Connection();
      const ready = await connection.ready;
      if (ready) {
        resolve(connection);
      } else {
        reject('Failed to establish a connection to the absurd-sql webworker');
      }
    });
  }

  async _query(connection: Connection, obj) {
    const { method } = obj;
    let callMethod: 'run' | 'all';
    switch (method) {
      case 'insert':
      case 'update':
      case 'counter':
      case 'del':
        callMethod = 'run';
        break;
      default:
        callMethod = 'all';
    }

    const result = await connection.exec({
      sql: obj.sql,
      bindings: obj.bindings,
      method: callMethod,
    });

    obj.response = result;
    obj.context = this;
    return obj;
  }

  _stream(connection, sql, stream) {
    throw new Error('Unsupported');
  }

  // Ensures the response is returned in the same format as other clients.
  // TODO: can we not just use the impl from
  // https://github.com/knex/knex/blob/master/lib/dialects/sqlite3/index.js ?
  processResponse(obj, runner) {
    const ctx = obj.context;
    let { response } = obj;
    switch (obj.method) {
      case 'pluck':
        throw new Error('Unsupported');
      case 'select':
        return response;
      case 'first':
        // const selectResult = map(get(response, [0, 'values']), (row) => zipObject(get(response, [0, 'columns']), row));
        return response[0];
      case 'insert':
      case 'del':
      case 'update':
      case 'counter':
        return [];
      default:
        return response;
    }
  }
}
