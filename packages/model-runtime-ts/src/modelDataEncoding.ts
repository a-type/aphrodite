import { FieldsSpec } from '@aphro/schema-api';

export function decodeModelData<D>(data: any, spec: FieldsSpec): D {
  const encodedFields = Object.entries(spec).filter(([key, value]) => value.encoding !== 'none');
  if (encodedFields.length === 0) {
    return data;
  }

  // we're actually just going to mutate the passed in data! here be dragons.
  // we _know_ that the input is never used by the caller.
  encodedFields.forEach(([key, value]) => {
    if (value.encoding === 'json') {
      data[key] = JSON.parse(data[key]);
    } else {
      throw new Error(`Unsupported encoding ${value} on field ${key}`);
    }
  });

  return data;
}

export function encodeModelData<D>(data: D, spec: FieldsSpec): any {
  const encodedFields = Object.entries(spec).filter(([key, value]) => value.encoding !== 'none');
  if (encodedFields.length === 0) {
    return data;
  }

  const ret = {
    ...data,
  };

  // we can't mutate the input because we know the input is cached and still in use.
  encodedFields.forEach(([key, value]) => {
    if (value.encoding === 'json') {
      ret[key] = JSON.stringify(ret[key]);
    } else {
      throw new Error(`Unsupported encoding ${value} on field ${key}`);
    }
  });

  return ret;
}
