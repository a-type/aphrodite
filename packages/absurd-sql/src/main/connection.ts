import count from '@strut/counter';
import thisPackage from '../pkg';

let queryId = 0;

const counter = count('@aphro/absurd-sql/Connection');

export default class Connection {
  #worker: Worker;
  #pending: {
    id: number;
    resolve: (v: any) => void;
    reject: (e: any) => void;
    promise: Promise<unknown>;
  }[] = [];

  constructor(worker: Worker) {
    counter.bump('create');
    window.addEventListener('message', this.#messageListener);
    this.#worker = worker;
  }

  // TODO: what type gets returned?
  async exec(queryObj): Promise<any> {
    counter.bump('exect-query');
    const id = queryId++;

    let resolvePending;
    let rejectPending;
    const promise = new Promise((resolve, reject) => {
      resolvePending = resolve;
      rejectPending = reject;
    });

    this.#pending.push({
      id,
      resolve: resolvePending,
      reject: rejectPending,
      promise,
    });

    this.#worker.postMessage({ pkg: thisPackage, event: 'query', queryObj, id });
  }

  #messageListener = ({ data }) => {
    const { pkg, id, event, result } = data;
    if (pkg !== thisPackage) {
      return;
    }
    if (event !== 'query-response') {
      return;
    }
    counter.bump('query-response');

    if (id == null) {
      counter.bump('no-id');
      return;
    }

    const index = this.#pending.findIndex(p => p.id === id);
    if (index === -1) {
      counter.bump('no-matching-id');
      return;
    }
    const pending = this.#pending[index];
    this.#pending.splice(index, 1);

    // TODO: handle rejection...

    pending.resolve(data);
  };

  destroy() {
    counter.bump('destroy');
    window.removeEventListener('message', this.#messageListener);
  }
}
