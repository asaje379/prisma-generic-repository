export function stringifyObject(data: Record<string, unknown>) {
  const result: Record<string, string> = {};

  for (const item in data) {
    result[item] = String(data[item]);
  }
  return result;
}
