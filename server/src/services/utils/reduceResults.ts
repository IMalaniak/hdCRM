import { Result } from 'neverthrow';

interface ValueErrorSplit<V, E> {
  values: V[];
  errors: E[];
}

export function reduceResults<V, E>(results: Result<V, E>[]): ValueErrorSplit<V, E> {
  return results.reduce(
    (acc, current) => {
      if (current.isOk()) {
        acc = { ...acc, values: [...acc.values, current.value] };
      } else {
        acc = { ...acc, errors: [...acc.errors, current.error] };
      }
      return acc;
    },
    {
      values: [],
      errors: []
    } as ValueErrorSplit<V, E>
  );
}
