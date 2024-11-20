export function selectObjectAttributes(
  object: Record<string, unknown>,
  attributes: string[],
): unknown[] {
  const values: unknown[] = [];

  return attributes.reduce((accumulator, attribute) => {
    if (Object.prototype.hasOwnProperty.call(object, attribute)) {
      accumulator.push(object[attribute]);
    }

    return accumulator;
  }, values);
}
